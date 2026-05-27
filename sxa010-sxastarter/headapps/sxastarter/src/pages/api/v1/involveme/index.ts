import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  function extractQuestionTexts(data: any): { [key: string]: string } {
    const result: { [key: string]: string } = {};
    if (Array.isArray(data?.questions)) {
      data.questions.forEach((q: any, idx: number) => {
        result[`Question_${idx + 1}`] = q.question_text;
      });
    }
    return result;
  }
  const query = req.body;

  const email = query?.data?.personal_data?.email || "";
  // const name = query?.data?.questions?.find((q: any) => q.question_text === "Before we start, what should we call you?")?.answers_given?.[0]?.response_text || "";
  const firstname = query?.data?.questions?.find((q: any) => q.question_text === "First Name")?.answers_given?.[0]?.response_text || "";
  const lastname = query?.data?.questions?.find((q: any) => q.question_text === "Last Name")?.answers_given?.[0]?.response_text || "";
  const participantId = query?.data?.participant_id || "";
  const projectName = query?.data?.project_name || "";
  const outcome = query?.data?.outcome || "";
  const outcomePoints = query?.data?.outcome_points || "";
  const optIn = query?.data?.questions?.find((q: any) => q.question_text === "Do you wish to receive an email copy of your quiz results?")?.checked ?? false;

  console.log("debugging:", req, res, query);
  console.log("debugging", projectName, email, name, outcome, outcomePoints);

  let formString = "";
  formString += "elqFormName=" + encodeURIComponent("involveme_bookatour_en") + "&";
  formString += "elqSiteId=" + encodeURIComponent("1816836") + "&";
  formString += "subscribe=" + encodeURIComponent(optIn ? "Yes" : "No") + "&";
  // formString += "FullName=" + encodeURIComponent(name) + "&";
  formString += "FirstName=" + encodeURIComponent(firstname) + "&";
  formString += "LastName=" + encodeURIComponent(lastname) + "&";
  formString += "emailAddress=" + encodeURIComponent(email) + "&";
  // formString += "ProjectName=" + encodeURIComponent(projectName) + "&";
  formString += "SourceSurveyHiddenField=" + encodeURIComponent(projectName) + "&";
  formString += "SurveyOutcome=" + encodeURIComponent(outcome) + "&";
  formString += "SurveyScore=" + encodeURIComponent(outcomePoints) + "&";
  formString += "SurveyParticipantId=" + encodeURIComponent(participantId) + "&";
  formString += "honeypot=&";

  // Extract questions and answers if present
  let count = 0;
  if (query?.data?.questions && Array.isArray(query.data.questions)) {
    query.data.questions.forEach((q: any) => {
      count = count + 1;
      const key = `Answer_${count}_quiz`;
      let answer = "";
      if (q.type === "checkbox" && typeof q.checked !== "undefined") {
        answer = q.checked;
      } else if (Array.isArray(q.answers_given) && q.answers_given.length > 0) {
        answer = q.answers_given[0].response_text;
      }
      // return {
      //   question: q.question_text,
      //   answer,
      // };
      formString += key + "=" + encodeURIComponent(answer) + "&";
    });
  }
  const questionTexts = extractQuestionTexts(query.data);
  formString += "questions=" + encodeURIComponent(JSON.stringify(questionTexts)) + "&";
  /*
  for (const key in query) {
    let value = query[key]?.toString() || "";
    if (value.charAt(0) === ",") {
      value = value.slice(1);
    }

    if (key == "optin" && value == "Off") {
      value = "";
    }

    if (key.includes("___cw")) {
      replacementKeyValues.push({ k: key, v: encodeURIComponent(value) });
    }

    if (key == "preferredDate") {
      const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

      if (regex.test(value)) {
        const dateParts = value.split("-");
        if (dateParts.length === 3) {
          const [year, month, day] = dateParts;
          value = `${month}/${day}/${year}`;
        }
      }
    }

    formString += key + "=" + encodeURIComponent(value) + "&";
  }
 
  replacementKeyValues.forEach((idx) => {
    const oldKey = idx.k.replace("___cw", "");
    const r = new RegExp(`(${oldKey}(___cw)?=[a-zA-Z0-9%]*&amp;)`, "gm");
    formString = formString.replace(r, "");
    formString += oldKey + "=" + idx.v + "&";
  });
  */
  formString = formString.replace(/\&$/, "");
  console.log("formString", formString);
  async function postJSON(formString: any) {
    try {
      //first fetch below is testing url
      // const response = await fetch("https://webhook-test.com/b2e259e6912e73392e7ff314f57c1f2f", {
      //   method: "POST",
      //   headers: {
      //     "content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      //   },
      //   body: formString,
      // });

      const response = await fetch("https://trk.living.chartwell.com/e/f2", {
        method: "POST",
        headers: {
          "content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: formString,
      });

      const result = await response;
      return res.status(200).json({ message: "success", res: result });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
  postJSON(formString);
}
