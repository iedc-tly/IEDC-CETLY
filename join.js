const communityLinks = {
    firstYear: "#",
    secondYear: "#",
    thirdYear: "#"
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
