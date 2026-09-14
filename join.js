const communityLinks = {
    firstYear: "https://chat.whatsapp.com/Gy4LWT6Ijje9Ks2TtISvlg?s=cl&p=a&mlu=4&ilr=4",
    secondYear: "https://chat.whatsapp.com/C6SPmFvzc2e7BUWDgphfrh?s=cl&p=a&mlu=4&ilr=4",
    thirdYear: "https://chat.whatsapp.com/Kuf2x7Fn8hN48oIkmffu8i?s=cl&p=a&mlu=4&ilr=4",
    fourthYear: "https://chat.whatsapp.com/FnEnrkQ1YU57O5UNWOYm84?s=cl&p=a&mlu=4&ilr=4"
};

const coreTeamLink = "FORM";

document.querySelectorAll(".community-link").forEach(link => {
    const linkName = link.dataset.link;

    link.href = communityLinks[linkName];
    link.target = "_blank";
    link.rel = "noopener noreferrer";
});

const coreTeamButton = document.querySelector("#coreTeamLink");

coreTeamButton.href = coreTeamLink;
coreTeamButton.target = "_blank";
coreTeamButton.rel = "noopener noreferrer";
