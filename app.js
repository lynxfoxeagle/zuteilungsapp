const STATE = {
    algorithm: 'SPZ',
    projectFile: null,
    studentFile: null,
    historyFile: null,
    projects: [],
    students: [],
    result: null
};

const elements = {
    projectFile: document.getElementById('projectFile'),
    studentFile: document.getElementById('studentFile'),
    historyFile: document.getElementById('historyFile'),
    projectFileName: document.getElementById('projectFileName'),
    studentFileName: document.getElementById('studentFileName'),
    historyFileName: document.getElementById('historyFileName'),
    runButton: document.getElementById('runButton'),
    progressSection: document.getElementById('progressSection'),
    progressFill: document.getElementById('progressFill'),
    progressText: document.getElementById('progressText'),
    resultSection: document.getElementById('resultSection'),
    resultMessage: document.getElementById('resultMessage'),
    downloadButton: document.getElementById('downloadButton'),
    btnSpz: document.getElementById('btn-spz'),
    btnIo: document.getElementById('btn-io'),
    spzInfo: document.getElementById('spz-info'),
    ioInfo: document.getElementById('io-info')
};

function init() {
    setupFileUploads();
    setupAlgorithmToggle();
}

function setupAlgorithmToggle() {
    function setAlgorithm(algo) {
        STATE.algorithm = algo;

        if (algo === 'SPZ') {
            elements.btnSpz.classList.add('active');
            elements.btnIo.classList.remove('active');
            elements.spzInfo.classList.remove('hidden');
            elements.ioInfo.classList.add('hidden');
        } else {
            elements.btnIo.classList.add('active');
            elements.btnSpz.classList.remove('active');
            elements.ioInfo.classList.remove('hidden');
            elements.spzInfo.classList.add('hidden');
        }
    }

    elements.btnSpz.addEventListener('click', () => setAlgorithm('SPZ'));
    elements.btnIo.addEventListener('click', () => setAlgorithm('IO'));
}

function setupFileUploads() {
    elements.projectFile.addEventListener('change', (e) => handleFileUpload(e, 'project'));
    elements.studentFile.addEventListener('change', (e) => handleFileUpload(e, 'student'));
    elements.historyFile.addEventListener('change', (e) => handleFileUpload(e, 'history'));
    elements.runButton.addEventListener('click', () => {
        if (STATE.projectFile && STATE.studentFile && STATE.historyFile) {
            run_assignment();
        } else {
            alert('Bitte beide Dateien hochladen.');
        }
    });
}

function updateRunButton() {
    if (STATE.projectFile && STATE.studentFile && STATE.historyFile) {
        elements.runButton.removeAttribute('disabled');
    } else {
        elements.runButton.setAttribute('disabled', 'true');
    }
}

function handleFileUpload(event, type) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target.result;
        try {
            if (type === 'project') {
                STATE.projectFile = true;
                STATE.projects = parseProjectsCSV(content);
                elements.projectFileName.parentElement.parentElement.classList.add('has-file');
                elements.projectFileName.textContent = file.name;
            } else if (type === 'student') {
                STATE.studentFile = true;
                STATE.students = parseStudentsCSV(content, STATE.rawHistoryCSV);
                elements.studentFileName.parentElement.parentElement.classList.add('has-file');
                elements.studentFileName.textContent = file.name;
            } else if (type === 'history') {
                STATE.historyFile = true;
                STATE.rawHistoryCSV = content;

                elements.historyFileName.parentElement.parentElement.classList.add('has-file');
                elements.historyFileName.textContent = file.name;
            }
            updateRunButton();
        } catch (err) {
            alert(`Fehler beim Parsen der ${type}-Datei: ${err.message}`);
        }
    };
    reader.readAsText(file, 'UTF-8');
}
``

function parseProjectsCSV(content) {
    const lines = content.trim().split(/\r?\n/).filter(line => line.trim());
    const projectList = [];

    for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',');
        if (parts.length < 2) continue;
        const name = parts.slice(0, -1).join(',').trim();
        const capacity = parseInt(parts[parts.length - 1].trim(), 10);
        if (!name || isNaN(capacity)) continue;
        projectList.push({
            'name': name,
            'id': projectList.length,
            'noSlots': 0,
            'capacity': capacity,
            'slots': [],
            'noVotes': 0,
            'votes': []
        });
    }
    console.log('projectList @@>> ', projectList)
    return projectList;
}

function parseStudentsCSV(content) {
    const lines = content.trim().split(/\r?\n/).filter(line => line.trim());
    if (lines.length < 2) throw new Error('Datei enthält keine Daten');

    const header = lines[0].split(',');
    const studentList = [];
    const numProjects = STATE.projects.length;

    for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',');
        if (cols.length < 4) continue;

        const student = {
            'id': studentList.length,
            'name': `${cols[0]?.trim() || ''} ${cols[1]?.trim() || ''}`,
            'assignedProject': None,
            'assignedPrjPriority': 0,
            'votes': [],
            'class': cols[2]?.trim() || '',
            'previousProjects': [{project: ''}],
        };

        for (let j = 0; j < numProjects; j++) {
            const projectName = STATE.projects[j]['name'];
            const voteIndex = header.indexOf(projectName);
            const vote = voteIndex >= 0 ? parseInt(cols[voteIndex]?.trim() || '0', 10) : 0;
            student['votes'].push(isNaN(vote) ? 0 : vote);
        }
        studentList.push(student);
    }
    console.log('studentList @@>> ', studentList)

    return studentList;
}
/*
    function parseStudentsCSV(content) {
        const lines = content.trim().split(/\r?\n/).filter(line => line.trim());
        if (lines.length < 2) throw new Error('Datei enthält keine Daten');

        const header = lines[0].split(',');
        const studentList = [];
        const numProjects = STATE.projects.length;

        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',');
            if (cols.length < 4) continue;

            const student = {
                'id': studentList.length,
                'name': `${cols[0]?.trim() || ''} ${cols[1]?.trim() || ''}`,
                'assignedProject': None,
                'assignedPrjPriority': 0,
                'votes': [],
                'class': cols[2]?.trim() || '',
                'previousProjects': [{project: ''}],
            };

            for (let j = 0; j < numProjects; j++) {
                const projectName = STATE.projects[j]['name'];
                const voteIndex = header.indexOf(projectName);
                const vote = voteIndex >= 0 ? parseInt(cols[voteIndex]?.trim() || '0', 10) : 0;
                student['votes'].push(isNaN(vote) ? 0 : vote);
            }
            studentList.push(student);
        }
        console.log('studentList @@>> ', studentList)

        return studentList;
    }

 */

function run_assignment() {
    if (STATE.algorithm === 'IO') {
        alert('Das IO-Verfahren ist noch nicht implementiert. Bitte wählen Sie SPZ.');
        return;
    }

    const projectList = STATE.projects;
    const studentList = STATE.students;

    const notAssignedProjectIndex = projectList.length;
    projectList.push({
        'name': 'Nicht zugeteilt',
        'id': notAssignedProjectIndex,
        'noSlots': 0,
        'capacity': 999999999999999,
        'slots': [],
        'noVotes': 0,
        'votes': []
    });

    // ------------------ Algorithmus ------------------

    function normalize() {
        for (const student of studentList) {
            const voteSum = student['votes'].reduce((a, b) => a + b, 0);
            for (let i = 0; i < student['votes'].length; i++) {
                const vote = student['votes'][i];
                student['votes'][i] = vote / voteSum;
                projectList[i]['noVotes'] += student['votes'][i];
                projectList[i]['votes'].push({'id': student['id'], 'value': student['votes'][i]});
            }
        }
    }

    function notAllSorted() {
        for (const project of projectList) {
            if (project['noVotes'] > 0.00001 && project['capacity'] > 0) {
                return true;
            }
        }
        return false;
    }

    function findSlot(projectNo, slotValue) {
        for (let i = 0; i < projectList[projectNo]['slots'].length; i++) {
            const slot = projectList[projectNo]['slots'][i];
            if (slot === slotValue) {
                return i;
            }
        }
        return -1;
    }

    function checkIfBetterProject(winner, wonPrj, i) {
        if (studentList[winner]['assignedProject'] === null) {
            studentList[winner]['assignedProject'] = wonPrj['id'];
            studentList[winner]['assignedPrjPriority'] = wonPrj['votes'][i]['value'];
            projectList[wonPrj['id']]['slots'].push(winner);
            projectList[wonPrj['id']]['capacity'] -= 1;
        } else if (studentList[winner]['assignedPrjPriority'] < wonPrj['votes'][i]['value']) {
            const oldPrj = studentList[winner]['assignedProject'];
            projectList[oldPrj]['slots'].splice(findSlot(oldPrj, winner), 1);
            projectList[oldPrj]['capacity'] += 1;
            studentList[winner]['assignedProject'] = wonPrj['id'];
            studentList[winner]['assignedPrjPriority'] = wonPrj['votes'][i]['value'];
            projectList[wonPrj['id']]['slots'].push(winner);
            projectList[wonPrj['id']]['capacity'] -= 1;
        }
    }

    normalize();

    while (notAllSorted()) {
        let maxProject = null;
        for (const project of projectList) {
            if ((maxProject === null || project['noVotes'] > maxProject['noVotes']) && project['capacity'] > 0) {
                maxProject = project;
            }
        }
        const randomNumber = Math.random() * maxProject['noVotes'];
        let i = -1;
        let randomNum = randomNumber;
        while (randomNum > 0 && i <= projectList[maxProject['id']]['votes'].length - 2 && projectList[maxProject['id']]['capacity'] > 0) {
            i += 1;
            randomNum -= maxProject['votes'][i]['value'];
        }
        checkIfBetterProject(parseInt(maxProject['votes'][i]['id']), maxProject, i);
        projectList[maxProject['id']]['noVotes'] -= maxProject['votes'][i]['value'];
        projectList[maxProject['id']]['votes'].splice(i, 1);
    }

    let valueAllocation = 0;
    for (const student of studentList) {
        if (student['assignedProject'] !== null) {
            valueAllocation += (student['assignedPrjPriority'] * 16);
//            console.log(student['assignedPrjPriority'] * 16);
        } else {
            valueAllocation -= 20;
        }
    }
    console.log(valueAllocation);
    console.log(JSON.stringify(studentList, null, 2));

    let nichtZugeteilt = 0;
    const csvRows = [];
    csvRows.push(['Id', 'Projekt', 'Lerngruppe']);
    for (const student of studentList) {
        if (student['assignedProject'] === null) {
            student['assignedProject'] = notAssignedProjectIndex;
            projectList[notAssignedProjectIndex]['slots'].push(student['id']);
            nichtZugeteilt += 1;
        }
        csvRows.push([
            student['name'],
            projectList[student['assignedProject']]['name'],
            student['class']
        ]);
    }

    for (const project of projectList) {
        csvRows.push(['Projekt ' + project['name']]);
        csvRows.push(['Schüler*In', 'Lerngruppe']);
        for (const studentId of project['slots']) {
            const student = studentList[studentId];
            csvRows.push([student['name'], student['class']]);
        }
    }

    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    console.log(csvContent);


    let countNotAssigned = 0;
    let countFirstChoice = 0;
    for (const student of studentList) {
        if (student['assignedProject'] !== null && student['assignedProject'] !== notAssignedProjectIndex) {
            let maxVote = -1;
            let firstChoiceProject = -1;
            for (let i = 0; i < student['votes'].length; i++) {
                if (student['votes'][i] > maxVote) {
                    maxVote = student['votes'][i];
                    firstChoiceProject = i;
                }
            }
            if (student['assignedProject'] === firstChoiceProject) {
                countFirstChoice += 1;
            }
        } else {
            countNotAssigned += 1;
        }
    }
    console.log('Nicht zugeteilt: ' + countNotAssigned);
    console.log('Erstwahl erfuellt: ' + countFirstChoice);
    console.log('studentList:', studentList);

    STATE.result = csvContent;
    STATE.studentList = studentList;
    STATE.projectList = projectList;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    let filename = prompt('Dateiname eingeben:', 'zuweisung');
    if (filename === null) return;
    if (!filename.endsWith('.csv')) filename += '.csv';
    downloadLink.download = filename;
    downloadLink.click();
    URL.revokeObjectURL(url);



    downloadCSV(STATE.studentList);
    return notAssignedProjectIndex;

}

function downloadCSV(studentList) {
    const headers = ["ID", "Name", "Class"];

    let maxProjects = 0;

    // Hilfsfunktion: nur echte Projekte behalten
    function getCleanHistory(student) {
        let history = (student.previousProjects || [])
            .filter(p => p && (p.project)); // leere Einträge entfernen

        // Falls ein Projekt zugewiesen ist
        if (student.assignedProject) {
            // 👉 Wenn KEINE Historie existiert → erste Zuteilung
            if (history.length === 0) {
                history = [{
                    date: new Date().toISOString().split("T")[0],
                    project: student.assignedProject
                }];
            } else {
                // 👉 sonst als neuestes anhängen
                history.push({
                    date: new Date().toISOString().split("T")[0],
                    project: student.assignedProject
                });
            }
        }

        return history;
    }

    // Max Projekteinträge bestimmen
    studentList.forEach(student => {
        const history = getCleanHistory(student);
        if (history.length > maxProjects) {
            maxProjects = history.length;
        }
    });

    // Header erweitern
    for (let i = 1; i <= maxProjects; i++) {
        headers.push(`Project_${i}_Name`);
    }

    const rows = [headers];

    // Daten erzeugen
    studentList.forEach(student => {
        const row = [
            student.id,
            student.name,
            student.class
        ];

        const history = getCleanHistory(student);

        history.forEach(entry => {
            row.push(entry.project || "");
        });

        // Auffüllen
        while (row.length < headers.length) {
            row.push("");
        }

        rows.push(row);
    });

    const csvContent = rows.map(r => r.join(";")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    a.click();

    URL.revokeObjectURL(url);
}

const None = null;

document.addEventListener('DOMContentLoaded', init);
