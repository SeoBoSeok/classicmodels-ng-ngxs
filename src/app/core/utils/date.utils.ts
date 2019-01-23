/**
 Copyright(c) 2009-2019 by GGoons.
*/

/**
*/
export class DateUtils {

  constructor() {
  }

  static secondsAgo = (num, now=null) => {
    now = now || new Date();
    now.setSeconds(now.getSeconds() - num);
    return now;
  };

  static minutesAgo = (num, now=null) => {
    now = now || new Date();
    now.setMinutes(now.getMinutes() - num);
    return now;
  };

  static hoursAgo = (num, now=null) => {
    now = now || new Date();
    now.setHours(now.getHours() - num);
    return now;
  };

  static daysAgo = (num, now=null) => {
    now = now || new Date();
    now.setDate(now.getDate() - num);
    return now;
  };

  static weeksAgo = (num, now=null) => {
    now = now || new Date();
    now.setDate(now.getDate() - (num*7));
    return now;
  };

  static monthsAgo = (num, now=null) => {
    now = now || new Date();
    now.setMonth(now.getMonth() - num);
    return now;
  };

  static yearsAgo = (num, now=null) => {
    now = now || new Date();
    now.setFullYear(now.getFullYear() - num);
    return now;
  };

  static secondsAfter = (num, now=null) => {
    now = now || new Date();
    now.setSeconds(now.getSeconds() + num);
    return now;
  };

  static minutesAfter = (num, now=null) => {
    now = now || new Date();
    now.setMinutes(now.getMinutes() + num);
    return now;
  };

  static hoursAfter = (num, now=null) => {
    now = now || new Date();
    now.setHours(now.getHours() + num);
    return now;
  };

  static daysAfter = (num, now=null) => {
    now = now || new Date();
    now.setDate(now.getDate() + num);
    return now;
  };

  static weeksAfter = (num, now=null) => {
    now = now || new Date();
    now.setDate(now.getDate() + (num*7));
    return now;
  };

  static monthsAfter = (num, now=null) => {
    now = now || new Date();
    now.setMonth(now.getMonth() + num);
    return now;
  };

  static yearsAfter = (num, now=null) => {
    now = now || new Date();
    now.setFullYear(now.getFullYear() + num);
    return now;
  };

  static duration = (ms1, ms2) => {
    return Math.abs(ms1 - ms2);
  };

  static milliSecondToSecond = (ms) => {
    return ms / 1000;
  };

  static milliSecondToMinute = (ms) => {
    return ms / (1000*60);
  };

  static milliSecondToHour = (ms) => {
    return ms / (1000*60*60);
  };

  static isInSeconds = (t, toSeconds) => {
    const duration = DateUtils.duration(Date.now(), t.getTime());
    const diffInSeconds = DateUtils.milliSecondToSecond(duration);
    return diffInSeconds <= toSeconds;
  };

  static isInMinutes = (t, toMinutes) => {
    const duration = DateUtils.duration(Date.now(), t.getTime());
    const diffInMinutes = DateUtils.milliSecondToMinute(duration);
    return diffInMinutes <= toMinutes;
  };

  static isInHours = (t, toHours) => {
    const duration = DateUtils.duration(Date.now(), t.getTime());
    const diffInHours = DateUtils.milliSecondToHour(duration);
    return diffInHours <= toHours;
  };

}
