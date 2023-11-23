const btn = document.querySelector(".button");
const template = document.querySelector(".template").content;
const mainWrap = document.querySelector(".wrap");

function getLink(url) {
  const adress = "https://api-ssl.bitly.com/v4/shorten";
  const token = "266a31b4d741ec0e028818903f6447125cca6e41";

  const curLink = fetch(adress, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      long_url: url,
    }),
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((data) => {
      return data.link;
    })
    .catch((err) => {
      return `Произошла ошибка: ${err}`;
    });

  return curLink;
}

function onResult(link) {
  link = link[0].result;
  const linkWrap = template.cloneNode(true);
  const wrap = linkWrap.querySelector(".link-wrap");

  wrap.querySelector(".link-text").textContent = link;
  wrap.querySelector(".copy").addEventListener("click", () => {
    navigator.clipboard.writeText(link);
  });

  if (!document.body.contains(document.querySelector(".link-wrap"))) {
    mainWrap.append(linkWrap);
  }
}

btn.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];

    if (tab) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          function: getLink,
          args: [tab.url],
        },
        onResult
      );
    }
  });
});
