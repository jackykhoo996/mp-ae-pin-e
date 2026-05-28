import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
 process.env.SUPABASE_URL,
 process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {

 if (req.method !== "POST") {
   return res.status(405).json({
     success:false
   });
 }

 const { msisdn, click_id } = req.body;

 try {

   const api =
   `https://m.bolo2vas102.click/c/pin/297170/4033?msisdn=${msisdn}&token=51bd5411badf480c8c1e3a5b8d3d653b`;

   const response = await fetch(api);

   const data = await response.json();

   let status = "pending";

   if (data.stateCode === 0) {
     status = "otp_sent";
   }

   const { error } = await supabase
   .from("conversions")
   .insert({
     msisdn,
     click_id,
     txid:data.txid || null,
     carrier:"Etisalat",
     status,
     cp_response:JSON.stringify(data)
   });

   console.log("SUPABASE ERROR:", error);

   return res.status(200).json({
     success:data.stateCode === 0,
     txid:data.txid || null
   });

 } catch (err) {

   return res.status(500).json({
     success:false,
     error:err.message
   });

 }
}