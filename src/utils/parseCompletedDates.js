export const parseCompletedDates = (habit) => {
  if (!habit) return [];

  let dates = habit.completed_dates;

  if(typeof dates === 'string'){
    try{
      dates = JSON.parse(dates);
    } catch(error){
      dates = [];
    }
  }

  return Array.isArray(dates) ? dates : [];
}


// была создана для решения ошибки с completed_dates. не пригодилась, решил оставить на потом