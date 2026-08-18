const communityLinks = {
    firstYear: "YOUR_FIRST_YEAR_WHATSAPP_LINK",
    secondYear: "YOUR_SECOND_YEAR_WHATSAPP_LINK",
    thirdYear: "YOUR_THIRD_YEAR_WHATSAPP_LINK"
};

const coreTeamLink = "YOUR_CORE_TEAM_FORM_LINK";

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
