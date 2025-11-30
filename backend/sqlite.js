import Database from "better-sqlite3";

const db = new Database("college_calendar.db");

export function getAllColleges() {
  const query = db.prepare(
    "SELECT id, name, acronym, aliases, timezone FROM colleges ORDER BY name ASC"
  );
  return query.all();
}

export function getTermsForCollege(collegeId, startDate, endDate) {
  const query = db.prepare(
    "SELECT * FROM academic_terms WHERE college_id = ? AND start_date >= ? AND end_date <= ? ORDER BY start_date ASC"
  );
  return query.all(collegeId, startDate, endDate);
}

export function getSemesterDetails(termId) {
  const daysOffQuery = db.prepare(
    "SELECT off_date FROM days_off WHERE term_id = ?"
  );
  const conversionQuery = db.prepare(
    "SELECT conversion_date, follows_schedule_of FROM instructional_conversions WHERE term_id = ? ORDER BY conversion_date ASC"
  );

  const daysOff = daysOffQuery.all(termId);
  const conversions = conversionQuery.all(termId);
  const formatted_daysOff = daysOff.map((dayOff) => {
    return dayOff.off_date;
  });
  const formatted_conversions = conversions.map((conversion) => {
    return [conversion.conversion_date, conversion.follows_schedule_of];
  });

  return {
    daysOff: formatted_daysOff,
    dayFollowsWeekday: formatted_conversions,
  };
}

// function runExample() {
//   console.log("--- All Colleges ---");
//   const colleges = getAllColleges();
//   console.log(colleges);

//   if (colleges.length > 0) {
//     const firstCollegeId = colleges[0].id;
//     console.log(
//       `\n--- Academic Terms for College ID ${firstCollegeId} in 2025 ---`
//     );
//     const terms = getTermsForCollege(
//       firstCollegeId,
//       "2025-01-01",
//       "2025-12-31"
//     );
//     console.log(terms);

//     if (terms.length > 0) {
//       const firstTermId = terms[0].id;
//       console.log(`\n--- Calendar Data for Term ID ${firstTermId} ---`);
//       const calendarData = getCalendarDataForTerm(firstTermId);
//       console.log(calendarData);
//     }
//   }
// }

getSemesterDetails(1);
