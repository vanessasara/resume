"use strict";

// Regex patterns for validation
const strRegex = /^[a-zA-Z\s]*$/;
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
const digitRegex = /^\d+$/;

// Form and elements
const mainForm = document.getElementById('cv-form');
const elements = mainForm.elements;
const displayElements = {
    fullname: document.getElementById('fullname_dsp'),
    image: document.getElementById('image_dsp'),
    phoneno: document.getElementById('phoneno_dsp'),
    email: document.getElementById('email_dsp'),
    address: document.getElementById('address_dsp'),
    designation: document.getElementById('designation_dsp'),
    summary: document.getElementById('summary_dsp'),
    projects: document.getElementById('projects_dsp'),
    achievements: document.getElementById('achievements_dsp'),
    skills: document.getElementById('skills_dsp'),
    educations: document.getElementById('educations_dsp'),
    experiences: document.getElementById('experiences_dsp')
};

// Constants for validation types
const validType = {
    TEXT: 'text',
    TEXT_EMP: 'text_emp',
    EMAIL: 'email',
    DIGIT: 'digit',
    PHONENO: 'phoneno',
    ANY: 'any'
};

// Function to fetch values from multiple elements
const fetchValues = (attributes, ...elementGroups) => {
    return elementGroups[0].map((_, i) => {
        const data = {};
        attributes.forEach((attr, j) => {
            data[attr] = elementGroups[j][i].value;
        });
        return data;
    });
};

// Generate a unique URL for the resume
function generateUniqueURL(username) {
    return `https://q2-hackathon.vercel.app/resume/${username}`;
}

// Update resume link based on form input
function updateResumeLink() {
    const [firstName, lastName] = [elements.namedItem('firstname').value, elements.namedItem('lastname').value].map(name => name.trim());
    const username = `${firstName}.${lastName}`.toLowerCase();

    if (username) {
        const resumeLinkInput = document.getElementById('resumeLink');
        resumeLinkInput.value = generateUniqueURL(username);
        document.getElementById('urlSection').style.display = 'block';
    } else {
        alert('Please fill out your name fields.');
    }
}

// Copy generated resume link to clipboard
function copyLink() {
    const resumeLink = document.getElementById('resumeLink');
    resumeLink.select();
    document.execCommand('copy');
    alert('Link copied to clipboard!');
}

// Gather user inputs from the form
const getUserInputs = () => ({
    firstname: elements.namedItem('firstname').value,
    middlename: elements.namedItem('middlename').value,
    lastname: elements.namedItem('lastname').value,
    designation: elements.namedItem('designation').value,
    address: elements.namedItem('address').value,
    email: elements.namedItem('email').value,
    phoneno: elements.namedItem('phoneno').value,
    summary: elements.namedItem('summary').value,
    achievements: fetchValues(['achieve_title', 'achieve_description'], Array.from(document.querySelectorAll('.achieve_title')), Array.from(document.querySelectorAll('.achieve_description'))),
    experiences: fetchValues(['exp_title', 'exp_organization', 'exp_location', 'exp_start_date', 'exp_end_date', 'exp_description'], Array.from(document.querySelectorAll('.exp_title')), Array.from(document.querySelectorAll('.exp_organization')), Array.from(document.querySelectorAll('.exp_location')), Array.from(document.querySelectorAll('.exp_start_date')), Array.from(document.querySelectorAll('.exp_end_date')), Array.from(document.querySelectorAll('.exp_description'))),
    educations: fetchValues(['edu_school', 'edu_degree', 'edu_city', 'edu_start_date', 'edu_graduation_date', 'edu_description'], Array.from(document.querySelectorAll('.edu_school')), Array.from(document.querySelectorAll('.edu_degree')), Array.from(document.querySelectorAll('.edu_city')), Array.from(document.querySelectorAll('.edu_start_date')), Array.from(document.querySelectorAll('.edu_graduation_date')), Array.from(document.querySelectorAll('.edu_description'))),
    projects: fetchValues(['proj_title', 'proj_link', 'proj_description'], Array.from(document.querySelectorAll('.proj_title')), Array.from(document.querySelectorAll('.proj_link')), Array.from(document.querySelectorAll('.proj_description'))),
    skills: fetchValues(['skill'], Array.from(document.querySelectorAll('.skill')))
});

// Form validation handler
function validateFormData(elem, type, name) {
    const value = elem.value.trim();
    const invalid = {
        [validType.TEXT]: () => !strRegex.test(value) || !value,
        [validType.TEXT_EMP]: () => !strRegex.test(value),
        [validType.EMAIL]: () => !emailRegex.test(value) || !value,
        [validType.PHONENO]: () => !phoneRegex.test(value) || !value,
        [validType.ANY]: () => !value
    }[type]();

    invalid ? addErrorMsg(elem, name) : removeErrorMsg(elem);
}

// Display error message
function addErrorMsg(elem, name) {
    elem.nextElementSibling.innerHTML = `${name} is invalid`;
}

// Remove error message
function removeErrorMsg(elem) {
    elem.nextElementSibling.innerHTML = "";
}

// Display list data in designated display container
function showListData(listData, container) {
    container.innerHTML = "";
    listData.forEach(item => {
        const itemElem = document.createElement('div');
        itemElem.className = 'preview-item';
        Object.values(item).forEach(value => {
            const subItem = document.createElement('span');
            subItem.className = 'preview-item-val';
            subItem.innerHTML = value;
            itemElem.appendChild(subItem);
        });
        container.appendChild(itemElem);
    });
}

// Display gathered CV data in display elements
function displayCV(data) {
    const { fullname, phoneno, email, address, designation, summary, projects, achievements, skills, educations, experiences } = displayElements;
    fullname.innerHTML = `${data.firstname} ${data.middlename} ${data.lastname}`;
    phoneno.innerHTML = data.phoneno;
    email.innerHTML = data.email;
    address.innerHTML = data.address;
    designation.innerHTML = data.designation;
    summary.innerHTML = data.summary;

    showListData(data.projects, projects);
    showListData(data.achievements, achievements);
    showListData(data.skills, skills);
    showListData(data.educations, educations);
    showListData(data.experiences, experiences);
}

// Generate the CV and display the URL section
function generateCV() {
    displayCV(getUserInputs());
    document.getElementById('urlSection').style.display = 'block';
}

// Preview selected image
function previewImage() {
    if (imageElem.files && imageElem.files[0]) {
        const reader = new FileReader();
        reader.readAsDataURL(imageElem.files[0]);
        reader.onload = (e) => {
            imageDsp.src = e.target.result;
        };
    } else {
        imageDsp.src = ''; // Optional: Set a default image
    }
}

// Print the CV
function printCV() {
    window.print();
}
