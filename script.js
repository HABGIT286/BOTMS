async function scan(){
    let domain = document.getElementById("domain").value;
    if(domain==""){ alert("Enter URL"); return }

    let resultBox = document.getElementById("result");
    resultBox.innerHTML="Scanning...";

    try{
        let response = await fetch("/scan", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({url: domain})
        });

        let data = await response.json();

        if(data.error){
            resultBox.innerHTML = "Error: " + data.error;
            return;
        }

        // عرض النتائج بشكل جميل
        let engines = data.data.attributes.results;
        let html = `<div class="line"><b>URL:</b> ${domain}</div>`;
        html += `<div class="line"><b>Last Analysis Stats:</b></div>`;
        html += `<ul>`;
        html += `<li>Malicious: ${data.data.attributes.stats.malicious}</li>`;
        html += `<li>Suspicious: ${data.data.attributes.stats.suspicious}</li>`;
        html += `<li>Undetected: ${data.data.attributes.stats.undetected}</li>`;
        html += `<li>Harmless: ${data.data.attributes.stats.harmless}</li>`;
        html += `</ul>`;

        html += `<div class="line"><b>Engines:</b></div>`;
        html += `<ul>`;
        for(let key in engines){
            let res = engines[key];
            html += `<li><b>${res.engine_name}</b>: ${res.result || "unrated"} (${res.category})</li>`;
        }
        html += `</ul>`;

        resultBox.innerHTML = html;

    }catch(e){
        resultBox.innerHTML="Error scanning site";
        console.error(e);
    }
}
