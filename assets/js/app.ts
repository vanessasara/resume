"use strict";

const strRegex = /^[a-zA-Z\s]*$/;  // Only letters
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
const digitRegex = /^\d+$/;

const mainForm = document.getElementById('cv-form') as HTMLFormElement;
const resumeLinkInput = document.getElementById('resumeLink') as HTMLInputElement;

type ValidType = 'text' | 'text_emp' | 'email' | 'digit' | 'phoneno' | 'any';

interface UserData {
    firstname: string;
    middlename: string;
    lastname: string;
    designation: string;
    address: string;
    email: string;
    phoneno: string;
    summary: string;
    achievements: any[];
    experiences: any[];
    educations: any[];
    projects: any[];
    skills: any[];
}

const generateUniqueURL = (username: string): string =>
    `https://q2-hackathon.vercel.app/resume/${username}`;

const updateResumeLink = (): void => {
    const firstName = (mainForm.elements.namedItem('firstname') as HTMLInputElement).value.trim();
    const lastName = (mainForm.elements.namedItem('lastname') as HTMLInputElement).value.trim();
    const username = `${firstName}.${lastName}`.toLowerCase();

    if (username) {
        resumeLinkInput.value = generateUniqueURL(username);
        document.getElementById('urlSection')!.style.display = 'block';
    } else {
        alert('Please fill out your name fields.');
    }
};

const copyLink = (): void => {
    resumeLinkInput.select();
    document.execCommand('copy');
    alert('Link copied to clipboard!');
};

const getUserInputs = (): UserData => {
    const getElements = (className: string): NodeListOf<HTMLInputElement> =>
        document.querySelectorAll(`.${className}`);

    return {
        firstname: (mainForm.elements.namedItem('firstname') as HTMLInputElement).value,
        middlename: (mainForm.elements.namedItem('middlename') as HTMLInputElement).value,
        lastname: (mainForm.elements.namedItem('lastname') as HTMLInputElement).value,
        designation: (mainForm.elements.namedItem('designation') as HTMLInputElement).value,
        address: (mainForm.elements.namedItem('address') as HTMLInputElement).value,
        email: (mainForm.elements.namedItem('email') as HTMLInputElement).value,
        phoneno: (mainForm.elements.namedItem('phoneno') as HTMLInputElement).value,
        summary: (mainForm.elements.namedItem('summary') as HTMLInputElement).value,
        achievements: fetchValues(['achieve_title', 'achieve_description'], getElements('achieve_title'), getElements('achieve_description')),
        experiences: fetchValues(['exp_title', 'exp_organization', 'exp_location', 'exp_start_date', 'exp_end_date', 'exp_description'],
            getElements('exp_title'), getElements('exp_organization'), getElements('exp_location'), getElements('exp_start_date'), getElements('exp_end_date'), getElements('exp_description')),
        educations: fetchValues(['edu_school', 'edu_degree', 'edu_city', 'edu_start_date', 'edu_graduation_date', 'edu_description'],
            getElements('edu_school'), getElements('edu_degree'), getElements('edu_city'), getElements('edu_start_date'), getElements('edu_graduation_date'), getElements('edu_description')),
        projects: fetchValues(['proj_title', 'proj_link', 'proj_description'], getElements('proj_title'), getElements('proj_link'), getElements('proj_description')),
        skills: fetchValues(['skill'], getElements('skill'))
    };
};

const fetchValues = (attrs: string[], ...nodeLists: NodeListOf<HTMLInputElement>[]): any[] => {
    return Array.from({ length: nodeLists[0].length }, (_, i) =>
        attrs.reduce((acc, attr, j) => ({ ...acc, [attr]: nodeLists[j][i].value }), {})
    );
};

const validateFormData = (elem: HTMLInputElement, elemType: ValidType, elemName: string): void => {
    const value = elem.value.trim();
    const isInvalid = (
        (elemType === 'text' && (!strRegex.test(value) || value.length === 0)) ||
        (elemType === 'email' && (!emailRegex.test(value) || value.length === 0)) ||
        (elemType === 'phoneno' && (!phoneRegex.test(value) || value.length === 0)) ||
        (elemType === 'any' && value.length === 0)
    );

    if (isInvalid) {
        addErrMsg(elem, `${elemName} is invalid`);
    } else {
        removeErrMsg(elem);
    }
};

const addErrMsg = (formElem: HTMLInputElement, message: string): void => {
    const errorElem = formElem.nextElementSibling as HTMLElement;
    if (errorElem) errorElem.innerHTML = message;
};

const removeErrMsg = (formElem: HTMLInputElement): void => {
    const errorElem = formElem.nextElementSibling as HTMLElement;
    if (errorElem) errorElem.innerHTML = "";
};

const displayCV = (userData: UserData): void => {
    document.getElementById('fullname_dsp')!.innerHTML = `${userData.firstname} ${userData.middlename} ${userData.lastname}`;
    document.getElementById('phoneno_dsp')!.innerHTML = userData.phoneno;
    document.getElementById('email_dsp')!.innerHTML = userData.email;
    document.getElementById('address_dsp')!.innerHTML = userData.address;
    document.getElementById('designation_dsp')!.innerHTML = userData.designation;
    document.getElementById('summary_dsp')!.innerHTML = userData.summary;

    const showListData = (listData: any[], listContainerId: string): void => {
        const listContainer = document.getElementById(listContainerId)!;
        listContainer.innerHTML = "";
        listData.forEach((item) => {
            const itemElem = document.createElement('div');
            itemElem.classList.add('preview-item');
            Object(item).forEach(value => {
                const subItemElem = document.createElement('span');
                subItemElem.classList.add('preview-item-val');
                subItemElem.innerHTML = `${value}`;
                itemElem.appendChild(subItemElem);
            });
            listContainer.appendChild(itemElem);
        });
    };

    showListData(userData.projects, 'projects_dsp');
    showListData(userData.achievements, 'achievements_dsp');
    showListData(userData.skills, 'skills_dsp');
    showListData(userData.educations, 'educations_dsp');
    showListData(userData.experiences, 'experiences_dsp');
};

const generateCV = (): void => {
    const userData = getUserInputs();
    displayCV(userData);
    console.log(userData);
    document.querySelector('#urlSection')!.style.display! = 'block';
};

const printCV = (): void => {
    window.print();
};

const previewImage = (): void => {
    const imageElem = mainForm.elements.namedItem('image') as HTMLInputElement;
    const imageDsp = document.getElementById('image_dsp') as HTMLImageElement;

    if (imageElem.files && imageElem.files[0]) {
        const oFReader = new FileReader();
        oFReader.readAsDataURL(imageElem.files[0]);
        oFReader.onload = (event) => {
            const target = event.target as FileReader;
            if (target.result) {
                imageDsp.src = target.result as string;
            }
        };
    } else {
        imageDsp.src = ''; // Default if no image
    }
};

(document.querySelector('#generateResumeLinkBtn') as HTMLElement)?.addEventListener('click', updateResumeLink);
(document.querySelector('#copyLinkBtn') as HTMLElement)?.addEventListener('click', copyLink);
