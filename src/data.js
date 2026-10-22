/* ====== EDIT DETAILS HERE ====== */
export const WHATSAPP_NUMBER = "919972865271";
export const EMAIL = "Itsmerahul.edit@gmail.com";
export const INSTAGRAM = ""; // e.g. "https://instagram.com/yourhandle"
export const YOUTUBE = "";   // e.g. "https://youtube.com/@yourchannel"

export const WA = `https://wa.me/${WHATSAPP_NUMBER}`;

// type: "instagram" | "youtube" | "short" (use "short" for a vertical YouTube Short)
// the numbers match the files in public/videos/ (video1.mp4, video2.mp4, ...)
export const videos = [1, 2, 3, 4, 9, 11, 12, 13, 14, 16, 17, 18,19,20].map((n) => ({
  src: `/videos/video${n}.mp4`,
}));

export const brands = [
  ["AURO", "B1.png"], 
  ["BUZZ BITE MEDIA", "B2.png"], 
  ["DELITE", "B3.png"],
  ["HERBAL LIFE INDIA", "B4.png"], 
  ["JUNA BAKERY", "B5.png"],
   ["PANTERRA LOGO", "B6.png"],
  ["PITSHOP", "B7.png"], 
  ["SALAD CREATION", "B8.png"], 
  ["STAGE MARATHI", "B9.png"],
  ["PALM","B10.png"],
  ["JMED","B11.png"],
  ["DAWAT","B12.png"],
  ["BAM","B13.png"],
  ["ALJRAIWY","B14.png"],
];

export const creators = [
  ["VIKALP MEHTA", "Instagram", "@vikalp_mehta", "Vikalp.png"],
  ["URFI JAVEED", "Youtube", "@TheUorfi", "URFI JAVEED.png"],
  ["KIRTI VERMA", "Instagram", "@kirtivermaofficial", "kirti.png"],
  ["GAURAV MEDATWAL", "Instagram", "@gaurav18medatwal", "GAURAV MEDATWAL.png"],
  ["MANISHA SAXENA", "Instagram", "@maneeshaa.saxenaa", "Manisha.png"],
  ["NOOR", "Instagram", "@noor_wav", "NOOR.png"],
];

