// src/fonts/registerNotoFont.js
import { jsPDF } from "jspdf";
import notoFont from "./NotoSansDevanagari-normal";

// Register the font
jsPDF.API.events.push(['addFonts', function () {
  this.addFileToVFS("NotoSansDevanagari.ttf", notoFont);
  this.addFont("NotoSansDevanagari.ttf", "NotoSansDevanagari", "normal");
}]);
