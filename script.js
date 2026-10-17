const passages = {
  en: [
    "Computer skills are useful in education, business and everyday life. Regular typing practice helps students improve speed, accuracy and confidence. Sit comfortably, keep your fingers near the home row and look at the screen instead of the keyboard. Start slowly and focus on correct spelling. As your accuracy improves, increase your speed gradually. Daily practice for a few minutes can make a real difference over time.",
    "A computer is an electronic machine that accepts data, processes it and produces information. The keyboard is used to enter letters, numbers and commands. A mouse helps us point, click and select items on the screen. We use a monitor to view text, pictures and videos. Learning basic computer skills can make schoolwork and office tasks easier and faster.",
    "Time management helps us complete important tasks without unnecessary stress. Make a short plan before you begin your work. Divide a large task into small steps and finish them one by one. Take brief breaks when needed, but return to your goal on time. Consistency is more useful than trying to do everything at once. Practice patiently and measure your progress every week."
  ],
  hi: [
    "कंप्यूटर आज शिक्षा, व्यापार और दैनिक जीवन का एक महत्वपूर्ण हिस्सा है। इसकी मदद से हम जानकारी लिख सकते हैं, गणना कर सकते हैं और इंटरनेट का उपयोग कर सकते हैं। नियमित अभ्यास से कंप्यूटर चलाने का आत्मविश्वास बढ़ता है। टाइपिंग सीखते समय सही अक्षरों पर ध्यान दें। शुरुआत में धीरे टाइप करें और धीरे-धीरे अपनी गति बढ़ाएँ। हर दिन अभ्यास करने से अच्छा परिणाम मिल सकता है।",
    "समय का सही उपयोग सफलता की दिशा में एक महत्वपूर्ण कदम है। हमें अपने काम की योजना बनानी चाहिए और जरूरी कार्य पहले पूरे करने चाहिए। किसी बड़े काम को छोटे हिस्सों में बाँटने से उसे पूरा करना आसान हो जाता है। अभ्यास करते समय धैर्य रखें और अपनी गलतियों से सीखें। नियमित मेहनत से ज्ञान, कौशल और आत्मविश्वास बढ़ता है।",
    "कंप्यूटर में कीबोर्ड एक इनपुट डिवाइस है। इसका उपयोग अक्षर, संख्या और विशेष चिन्ह लिखने के लिए किया जाता है। माउस की सहायता से हम स्क्रीन पर कर्सर को चलाते हैं और अलग-अलग विकल्प चुनते हैं। मॉनिटर हमें टेक्स्ट, चित्र और वीडियो दिखाता है। इन उपकरणों का सही उपयोग सीखकर हम कंप्यूटर पर आसानी से काम कर सकते हैं।"
  ]
};
const $ = id => document.getElementById(id);
let running = false, finished = false, startedAt = 0, timerId = null;
function getPassage(){return passages[$("language").value][Number($("passageChoice").value)];}
function formatTime(seconds){seconds=Math.max(0,Math.ceil(seconds));return `${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`;}
function getMetrics(){
  const typed=$("typing").value, target=getPassage();
  let correct=0;
  for(let i=0;i<typed.length;i++) if(i<target.length && typed[i]===target[i]) correct++;
  const elapsedMinutes=startedAt ? Math.max((Date.now()-startedAt)/60000,1/60) : 1;
  const accuracy=typed.length ? Math.round(correct/typed.length*100) : 100;
  const wpm=Math.round((correct/5)/elapsedMinutes);
  $("wpm").textContent=String(Math.max(0,wpm));
  $("accuracy").textContent=`${Math.max(0,accuracy)}%`;
  $("correct").textContent=String(correct);
  return {correct,wpm:Math.max(0,wpm),accuracy:Math.max(0,accuracy),typed:typed.length};
}
function tick(){
  const duration=Number($("duration").value);
  const left=Math.max(0,duration*60-(Date.now()-startedAt)/1000);
  $("time").textContent=formatTime(left);
  getMetrics();
  if(left<=0) finishTest();
}
function startTest(){
  if(running)return;
  if(finished) resetTest();
  startedAt=Date.now();running=true;finished=false;
  $("typing").disabled=false;$("typing").focus();
  $("status").textContent="टेस्ट चल रहा है…";$("result").hidden=true;
  timerId=setInterval(tick,250);tick();
}
function finishTest(){
  if(!running && finished)return;
  if(running){clearInterval(timerId);timerId=null;}
  running=false;finished=true;$("typing").disabled=true;
  const m=getMetrics();
  $("status").textContent="टेस्ट पूरा हुआ";
  $("finalWpm").textContent=String(m.wpm);
  $("finalAcc").textContent=`${m.accuracy}%`;
  $("finalCorrect").textContent=String(m.correct);
  $("resultNote").textContent=`आपने ${m.typed} अक्षर टाइप किए। बेहतर परिणाम के लिए नियमित अभ्यास करें।`;
  $("result").hidden=false;
}
function resetTest(){
  clearInterval(timerId);timerId=null;running=false;finished=false;startedAt=0;
  $("typing").value="";$("typing").disabled=true;
  $("time").textContent=formatTime(Number($("duration").value)*60);
  $("wpm").textContent="0";$("accuracy").textContent="100%";$("correct").textContent="0";
  $("status").textContent="Start दबाएँ";$("result").hidden=true;
}
function updatePassage(){
  $("passage").textContent=getPassage();
  $("passage").lang=$("language").value==="hi"?"hi":"en";
  resetTest();
}
$("start").addEventListener("click",startTest);
$("reset").addEventListener("click",resetTest);
$("finish").addEventListener("click",finishTest);
$("typing").addEventListener("input",()=>{if(!running)return;getMetrics();if($("typing").value.length>=getPassage().length)finishTest();});
$("language").addEventListener("change",updatePassage);
$("passageChoice").addEventListener("change",updatePassage);
$("duration").addEventListener("change",resetTest);
$("year").textContent=new Date().getFullYear();
updatePassage();
