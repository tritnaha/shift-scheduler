import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './../Navbar';
import HashLoader from 'react-spinners/HashLoader';
import { useUserContext } from './../useUserContext';
import { format, addDays, eachDayOfInterval, nextSunday, getISOWeek, parseISO } from 'date-fns';
import { fo } from 'date-fns/locale';
import DesktopView from './DesktopView';
import MobileView from './MobileView';
import axios from 'axios';

const WeekSchedule = () => {
  const { user } = useUserContext();
  const [datesArr, setDatesArr] = useState(null);
  const [table, setTable] = useState(null);
  const [showSchedule, setShowSchedule] = useState(true);

  useEffect(() => {
    const response = axios.get('/getSchedule');
    response.then((res) => {
      setTable(res.data[0].data);
      const scheduleWeekNumber = getISOWeek(parseISO(res.data[0].date));
      const currentWeekNumber = getISOWeek(new Date());
      if (scheduleWeekNumber !== currentWeekNumber) setShowSchedule(false);
    });

    const currentDate = new Date();
    const start = nextSunday(currentDate);
    const end = addDays(start, 5);
    setDatesArr(eachDayOfInterval({ start, end }));
  }, []);

  let navigate = useNavigate();

  switch (true) {
    case !user:
      return (
        <>
          <div className="grid w-screen h-screen place-items-center">
            <HashLoader className="content-center" size={100} />
            <h3>Løðir, vinarliga bíða...</h3>
          </div>
        </>
      );
    case user && user.isAuthenticated === true:
      break;
    case user && user.isAuthenticated === false:
      navigate('/login');
      break;
    default:
      break;
  }

  const formatDay = (date) => {
    return format(date, 'd LLLL', { locale: fo });
  };

  const getDayFaroese = (date) => {
    return format(date, 'EEEE', { locale: fo });
  };

  const showOnlyMySchedule = (e) => {
    e.preventDefault();

    const onlyMe = table.map((day) => {
      return day.filter((employee, index) => {
        if (employee.username === user.username) {
          console.log(`${index + 1}/${day.length}`);
          if (index + 1 === (day.length - 4 || day.length - 2)) {
            console.log('Miðja');
          }
        }
        return employee.username === user.username;
      });
    });
    console.log(onlyMe);
    setTable(onlyMe);
  };

  return (
    <>
      <Navbar />
      <div>
        <div className="grid mt-5 place-items-center" dir="ltr">
          <div className="w-11/12 md:w-5/6 lg:w-5/6">
            <div className="flex justify-between">
              <h1 className="text-3xl font-semibold">Núverandi arbeiðsætlan</h1>
              {!user.admin && table && (
                <button
                  onClick={(e) => showOnlyMySchedule(e)}
                  className="px-2 py-1 text-base font-semibold text-white bg-gray-600 rounded-full focus:outline-none focus:ring focus:ring-blue-300 hover:bg-sky-700"
                >
                  Bara eg
                </button>
              )}
            </div>
            <h3>
              {datesArr && formatDay(datesArr[0])} - {datesArr && formatDay(datesArr[5])}
            </h3>
            <div>
              {table && table.length > 0 ? (
                <div className="flex lg:grid lg:place-items-center md:grid md:place-items-center ">
                  <div className="hidden w-full mt-10 md:table md:w-11/12 lg:w-9/12" dir="ltr">
                    {table ? (
                      <div className="table-header-group text-xl">
                        <div className="table-row font-bold">
                          <div className="table-cell p-2 border-b wrap">
                            Sunnudagur
                            <span className="block text-sm font-normal break-words">
                              {datesArr && formatDay(datesArr[0])}
                            </span>
                          </div>
                          <div className="table-cell p-2 border-b">
                            Mánadagur{' '}
                            <span className="block text-sm font-normal">
                              {datesArr && formatDay(datesArr[1])}
                            </span>
                          </div>
                          <div className="table-cell p-2 border-b">
                            Týsdagur
                            <span className="block text-sm font-normal">
                              {datesArr && formatDay(datesArr[2])}
                            </span>
                          </div>
                          <div className="table-cell p-2 border-b">
                            Mikudagur
                            <span className="block text-sm font-normal">
                              {datesArr && formatDay(datesArr[3])}
                            </span>
                          </div>
                          <div className="table-cell p-2 border-b">
                            Hósdagur
                            <span className="block text-sm font-normal">
                              {datesArr && formatDay(datesArr[4])}
                            </span>
                          </div>
                          <div className="table-cell p-2 border-b">
                            Fríggjadagur
                            <span className="block text-sm font-normal">
                              {datesArr && formatDay(datesArr[5])}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    <DesktopView table={table} datesArr={datesArr} />
                  </div>

                  <MobileView
                    table={table}
                    getDayFaroese={getDayFaroese}
                    datesArr={datesArr}
                    formatDay={formatDay}
                  />
                </div>
              ) : (
                <h1 className="text-3xl font-medium text-center my-28 text-slate-800">
                  Eingin arbeiðsætlan almannakunngjørd
                </h1>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WeekSchedule;
