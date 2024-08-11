// ==UserScript==
// @name         Show GPA
// @namespace    http://tampermonkey.net/
// @version      2024-08-02
// @description  Calulate and show the GPA on HCMUS Portal
// @author       Lê Đức Thành
// @match        https://*.hcmus.edu.vn/SinhVien.aspx?pid=211
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu.vn
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const tbl = document.getElementById('tbDiemThiGK');
    let marks = [], weights = [], weights_total = 0;
    for (const row of tbl.children[1].children) {
        const cols = row.children;
        if (cols[5].innerText && !isNaN(Number(cols[5].innerText)) && !['ADD0003', 'BAA0002', 'BAA0003'].includes(cols[1].innerText.slice(0, 7)) && !cols[1].innerText.includes('CSC00003')) {
            marks.push(Number(cols[5].innerText));
            weights.push(Number(cols[2].innerText));
            weights_total += weights[weights.length - 1];
        }
    }
    let gpa = 0, gpa_4, grade;
    for (const i in marks) {
        gpa += marks[i] * weights[i] / weights_total;
    }
    if (gpa >= 9) gpa_4 = 4;
    else if (gpa >= 8) gpa_4 = 3.5;
    else if (gpa >= 7) gpa_4 = 3;
    else if (gpa >= 6) gpa_4 = 2.5;
    else if (gpa >= 5) gpa_4 = 2;
    else if (gpa >= 4) gpa_4 = 1.5;
    else if (gpa >= 3) gpa_4 = 1;
    else gpa_4 = 0;
    switch (gpa_4) {
        case 4:
            grade = 'A+';
            break;
        case 3.5:
            grade = 'A';
            break;
        case 3:
            grade = 'B+';
            break;
        case 2.5:
            grade = 'B';
            break;
        case 2:
            grade = 'C';
            break;
        case 1.5:
            grade = 'D+';
            break;
        case 1:
            grade = 'D';
            break;
        default:
            grade = 'F';
    }
    const footer = document.createElement('tfoot');
    const row = document.createElement('tr');
    const th_weights_total_header = document.createElement('th');
    const th_weights_total_data = document.createElement('th');
    const th_gpa_header = document.createElement('th');
    const th_gpa_data = document.createElement('th');
    const th_gpa_note = document.createElement('th');
    tbl.appendChild(footer);
    footer.appendChild(row);
    row.appendChild(th_weights_total_header);
    row.appendChild(th_weights_total_data);
    row.appendChild(th_gpa_header);
    row.appendChild(th_gpa_data);
    row.appendChild(th_gpa_note);
    
    th_weights_total_header.innerText = 'Tổng tín chỉ tích lũy:';
    th_weights_total_header.style.setProperty('text-align', 'right');
    th_weights_total_header.setAttribute('colspan', '2');
    
    th_weights_total_data.innerText = weights_total;
    th_weights_total_data.style.setProperty('text-align', 'center');
    
    th_gpa_header.innerText = 'GPA:';
    th_gpa_header.style.setProperty('text-align', 'right');
    th_gpa_header.setAttribute('colspan', '2');
    
    th_gpa_data.innerText = gpa.toFixed(2);
    th_gpa_data.style.setProperty('text-align', 'left');
    
    th_gpa_note.innerText = `Điểm 4: ${gpa_4}; Điểm chữ: ${grade}`;
    th_gpa_note.style.setProperty('text-align', 'left');
})();