import { defineWebModule } from "../../apps/web/app/modules.ts";
import { IconDoc, IconGrid } from "../../apps/web/app/components/icons.tsx";
export default defineWebModule({ name: "robotaxi", root: { bootScript: "try{if(!localStorage.getItem('aihot-theme')){localStorage.setItem('aihot-theme','dark');document.documentElement.setAttribute('data-theme','dark')}}catch{}" }, sidebar: { section: "Robotaxi", items: [
  { to: "/industry", label: "行业报告", icon: IconDoc },
  { to: "/financing", label: "融资概览", icon: IconGrid },
  { to: "/media/international", label: "国外媒体", icon: IconGrid },
  { to: "/media/china", label: "国内媒体", icon: IconGrid },
] }, tools: [
  { to: "/industry", label: "行业报告", icon: <IconDoc size={18} /> },
  { to: "/financing", label: "融资概览", icon: <IconGrid size={18} /> },
  { to: "/media/international", label: "国外媒体", icon: <IconGrid size={18} /> },
  { to: "/media/china", label: "国内媒体", icon: <IconGrid size={18} /> },
] });
