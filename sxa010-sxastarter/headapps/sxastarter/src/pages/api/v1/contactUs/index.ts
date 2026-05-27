import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let formString = "";
  console.log("API Route Invoked - /api/v1/contactUs", req.body);

  async function postJSON(formString: any) {
    try {
      //first fetch below is testing url
      // const response = await fetch("https://webhook-test.com/546b2bac86766aeec25a0adcc8c395f9", {
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

      const result = await response.text();
      res.status(200).json({ message: "success", res: result, formString });
    } catch (error) {
      res.status(500).json({ message: String(error) });
    }
  }

  const doSitecoreFormSubmit = async () => {
    const replacementKeyValues = [];

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

    formString = formString.replace(/\&$/, "");

    await postJSON(formString);
  };

  const doInvolveMeFormSubmit = async () => {
    const email = query?.data?.personal_data?.email || "";

    const lang = query?.data?.project_name.includes("(FR)") ? "fr" : "en";

    const fields = {
      en: { fname: "First Name", lname: "Last Name", postalCode: "Postal Code", optIn: "Do you wish to receive an email copy of your quiz results?" },
      fr: { fname: "Prénom", lname: "Nom", postalCode: "Code postal", optIn: "Souhaitez-vous recevoir une copie de vos résultats du questionnaire par courriel?" },
    };

    const fname = query?.data?.questions?.find((q: any) => q.question_text?.toLowerCase() === fields[lang].fname.toLowerCase())?.answers_given?.[0]?.response_text || "";
    const lname = query?.data?.questions?.find((q: any) => q.question_text?.toLowerCase() === fields[lang].lname.toLowerCase())?.answers_given?.[0]?.response_text || "";
    const postalCode = query?.data?.questions?.find((q: any) => q.question_text?.toLowerCase() === fields[lang].postalCode.toLowerCase())?.answers_given?.[0]?.response_text || "";
    const participantId = query?.data?.participant_id || "";
    const projectName = query?.data?.project_name || "";
    const outcome = query?.data?.outcome || "";
    const outcomePoints = query?.data?.outcome_points || "";
    const optIn = query?.data?.questions?.find((q: any) => q.question_text?.toLowerCase() === fields[lang].optIn.toLowerCase())?.answers_given?.[0]?.response_text || "";
    // console.log("debugging:", req, res, query);
    // console.log("debugging", projectName, email, outcome, outcomePoints);

    formString += "elqFormName=" + encodeURIComponent(`resource_quizzes_submission_${lang}`) + "&";
    formString += "elqSiteId=" + encodeURIComponent("1816836") + "&";
    formString += "subscribe=" + encodeURIComponent(optIn) + "&";
    //formString += "FullName=" + encodeURIComponent(name) + "&";
    formString += "FirstName=" + encodeURIComponent(fname) + "&";
    formString += "LastName=" + encodeURIComponent(lname) + "&";
    if (postalCode) {
      formString += "zipPostal=" + encodeURIComponent(postalCode) + "&";
    }
    formString += "emailAddress=" + encodeURIComponent(email) + "&";
    formString += "funnelName=" + encodeURIComponent(projectName) + "&";
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
        formString += key + "=" + encodeURIComponent(answer) + "&";

        const qKey = `Question_${count}_Text`;
        const qText = q.question_text || "";
        formString += qKey + "=" + encodeURIComponent(qText) + "&";
      });
    }
    // const questionTexts = extractQuestionTexts(query.data);
    // formString += "questions=" + encodeURIComponent(JSON.stringify(questionTexts)) + "&";
    formString = formString.replace(/\&$/, "");
    //console.log("formString", formString);
    await postJSON(formString);
  };

  const query = req.body;

  try {
    if (query?.event && query?.event?.type == "finished_participant" && query?.data?.hasOwnProperty("participant_id") && query?.data?.hasOwnProperty("project_name")) {
      await doInvolveMeFormSubmit();
    } else {
      await doSitecoreFormSubmit();
    }
  } catch (error) {
    res.status(500).json({ message: String(error) });
  }
}
