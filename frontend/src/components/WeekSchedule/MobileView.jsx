import React from 'react';
import { format } from 'date-fns';
import { fo } from 'date-fns/locale';

export default function MobileView({ table, getDayFaroese, datesArr }) {
  const formatDay = (date) => {
    return format(date, 'd LLLL', { locale: fo });
  };

  return (
    <div className="table w-full md:hidden after:mt-10" dir="ltr">
      {table ? (
        datesArr.map((e, i) => {
          return (
            <div key={i} className="w-7/12 mx-auto text-3xl my-14">
              <div className="font-bold" key={i}>
                <div className="border-b-2" key={i}>
                  {getDayFaroese(datesArr[i])}{' '}
                  <span className="block text-lg font-normal break-words">
                    {formatDay(datesArr[i])}
                  </span>
                </div>
              </div>
              {table &&
                table[i].map((employee, employeeIndex) => {
                  if (table[i].length - 2 <= employeeIndex && table[i].length > 1) {
                    return (
                      <div className="mobileview__employee" key={employee._id}>
                        <p key={employee._id}>{employee.username}</p>
                        <p className="mt-auto mr-1 text-sm">Kvøld</p>
                      </div>
                    );
                  } else if (table[i].length - 4 <= employeeIndex && table[i].length > 2) {
                    return (
                      <div className="mobileview__employee" key={employee._id}>
                        <p key={employee._id}>{employee.username}</p>
                        <p className="mt-auto mr-1 text-sm">Miðja</p>
                      </div>
                    );
                  } else {
                    return (
                      <div className="mobileview__employee" key={employee._id}>
                        <p key={employee._id}>{employee.username}</p>
                      </div>
                    );
                  }
                })}
              {/* <span className="text-xs font-semibold"> (Miðja)</span> */}
            </div>
          );
        })
      ) : (
        <h1 className="text-2xl font-medium text-center my-28 text-slate-800">Eingin arbeiðsætlan almannakunngjørd</h1>
      )}
    </div>
  );
}
