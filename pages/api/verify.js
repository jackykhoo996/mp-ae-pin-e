import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
 process.env.SUPABASE_URL,
 process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {

 const { txid, pin, click_id } = req.body;

 try {

   const api =
   `https://m.bolo2vas102.click/c/pin/verify?txid=${txid}&pin=${pin}&token=51bd5411badf480c8c1e3a5b8d3d653b`;

   const response = await fetch(api);

   const data = await response.json();

   let status = "failed";

   if (data.stateCode === 0) {

     status = "verified";

     // postback to voluum
     await fetch(
       `http://citcycle-sative.com/postback?cid=${click_id}&payout=3.5`
     );

   }

   if (data.stateCode === 2) {
     status = "processing";
   }

   await supabase
   .from("conversions")
   .update({
     status,
     cp_response:JSON.stringify(data)
   })
   .eq("txid", txid);

   return res.status(200).json({
     success:data.stateCode === 0
   });

 } catch(err) {

   return res.status(500).json({
     success:false,
     error:err.message
   });

 }
}