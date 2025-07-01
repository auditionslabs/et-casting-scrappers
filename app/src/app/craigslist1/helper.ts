type initResponse = {
    nonce: string;
    id: string;
    error?: string;
}

type mailtoResponse = {
    mailtoUri: string;
    email: string;
    id: string;
    webmailLinks: {
        "outlook": string,
        "yahoo": string,
        "gmail": string,
        "aol": string
    }
}


export async function getJobReplayEmail(job_id: number) {
    const url1 = `https://losangeles.craigslist.org/reply/lax/tlg/${job_id}/init'`;
    const form1 = new FormData();
    form1.append('browserinfo3', '{}');

    const options: RequestInit = { method: 'POST' };

    options.body = form1;
    let nonce: string = "";
    try {
        const response = await fetch(url1, options);
        console.log("URL 1 response: ", response);
        const data = await response.json() as initResponse;
        nonce = data.nonce;
        console.log(data);
    } catch (error) {
        console.error(error);
    }


    const url2 = `https://losangeles.craigslist.org/reply/lax/tlg/${job_id}/mailto`;
    const form2 = new FormData();
    form2.append('n', nonce);
    form2.append('nohtml', '1');

    const options2: RequestInit = { method: 'POST' };
    options2.body = form2;

    try {
        const response2 = await fetch(url2, options2);
        const data2 = await response2.json() as mailtoResponse;
        return {status: "success", email: data2.email};
    } catch (error) {
        console.error(error);
    }

    return {status: "error", email: ""}

}
