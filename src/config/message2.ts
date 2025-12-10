/**
 * MESSAGE 2 CONFIGURATION
 * 
 * This file contains all settings for Message 2.
 * Modify the values below to customize what gets sent, when, and to whom.
 * 
 * IMPORTANT: The cron runs once per day at 9:00 AM Madrid time.
 * Messages scheduled for that day will be sent at that time.
 */

import { MessageConfig } from '@/types';

const message2: MessageConfig = {
  id: 'message2',

  text_it: `Condividerò con te
<b>L'80% dei ricavi</b>
da ogni utente che inviti

Unisciti al programma di affiliazione nelle impostazioni del bot, <b>dillo ai tuoi amici e ai tuoi follower</b> e inizia a guadagnare... 🥰😏`,

  text_es: `Compartiré contigo
<b>el 80% de los ingresos</b>
por cada usuario que invites

Únete al programa de afiliados en los ajustes del bot, <b>cuéntaselo a tus amigos y seguidores</b> y empieza a ganar... 🥰😏`,

  text_en: `I will share with you
<b>80% of the revenue</b>
for every user you invite

Join the affiliate program in the bot settings, <b>tell your friends and followers</b> and start earning… 🥰😏`,

  media_it: ["AgACAgQAAxkDAAJIOmk4vXPAbKs0ZkXcu4c58GPrRG_VAAKSDGsbHoHIUbVKJ7ujnAEKAQADAgADdwADNgQ"],
  media_es: [],
  media_en: [],

  video_it: ["BAACAgQAAxkDAAJIYmk5XpHM_yLbcpKjguk2-pRrb5_MAAIeHwAC343JUTeGCr34uQiWNgQ"],
  video_es: [],
  video_en: [],

  protect_content: true,
  
  buttons: [
    {
      text_it: '',
      text_es: '',
      text_en: '',
      url: '',
    }
    
  // ============================================================================
  // SCHEDULE (Day-based patterns - messages sent at configured time)
  // See src/config/setHour.ts to change the daily execution time
  // 
  // "SUNDAY"      = Every Sunday
  // "MONDAY-2"    = Second Monday of every month
  // "MONTHLY-15"  = 15th day of every month
  // ============================================================================
  schedule: [],

  // Hours after which the message auto-deletes (0 = never delete)
  messageLifeHours: 24,
};

export default message2;
