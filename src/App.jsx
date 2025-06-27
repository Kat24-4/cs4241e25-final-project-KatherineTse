import {useState, useEffect, useRef} from 'react'
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import {alpha, styled} from "@mui/material";

const ODD_OPACITY = 0.15;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
    [`& .${gridClasses.row}.even`]: {
        backgroundColor:  theme.palette.grey[200],
        '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
            '@media (hover: none)': {
                backgroundColor: 'transparent',
            },
        },
    },
    [`& .${gridClasses.row}.odd`]: {
        backgroundColor: '#ffffff',
        '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
            '@media (hover: none)': {
                backgroundColor: 'transparent',
            },
        },
    }
}));

function App() {
    const renderEditButton = (params) => {
        return (
            <button className="p-2 m-[6px] rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-700" onClick={ () => swapForm("editForm", params.row.editButton) }>Edit Entry</button> //text-center rounded-xl text-blue-600 font-bold underline hover:no-underline hover:text-blue-900
        );
    }

    const columns = [
        {field: 'id', headerName: '#', width: 50, display: 'flex'},
        {field: 'compInfo', headerName: 'Competition Information', width: 250, display: 'flex'},
        {field: 'year', headerName: 'Year', width: 60, display: 'flex'},
        {field: 'program', headerName: 'Program', width: 80, display: 'flex'},
        {field: 'level', headerName: 'Level', width: 85, display: 'flex'},
        {field: 'vaultScore', headerName: 'Vault Score', width: 105, display: 'flex'},
        {field: 'barScore', headerName: 'Bar Score', width: 90, display: 'flex'},
        {field: 'beamScore', headerName: 'Beam Score', width: 105, display: 'flex'},
        {field: 'floorScore', headerName: 'Floor Score', width: 105, display: 'flex'},
        {field: 'totalScore', headerName: 'Total Score', width: 105, display: 'flex'},
        {field: 'editButton', headerName: 'Edit', width: 120, renderCell: renderEditButton, display: 'flex' },
    ]

    // Sends request to server to get data when website is first loaded.
    // Calls function to display data if there is any or sends alter to new user that their account has successfully been created
    useEffect( () => {
        async function getName() {
            const res = await fetch("/api/getName", {
                method: 'GET',
            })

            const data = await res.text()
            const currName = JSON.parse(data)

            setName(currName)
        }

        async function loadData() {
            // send Get request asking for data
            const response = await fetch("/api/loadData", {
                method: "GET",
            })

            // wait for data and then send it to be displayed
            const appdata = await response.text()

            const data = JSON.parse(appdata)

            if (data === "new") {
                alert("New user created with username and password. Welcome!");
            } else {
                parseData(data);
            }
        }
        getName()
        loadData()

    }, [])

    const [name, setName] = useState('')

    const [id, setId] = useState('');
    const [compInfo, setCompInfo] = useState('');
    const [year, setYear] = useState('');
    const [program, setProgram] = useState('');
    const [level, setLevel] = useState('');
    const [vaultScore, setVaultScore] = useState('');
    const [barScore, setBarScore] = useState('');
    const [beamScore, setBeamScore] = useState('');
    const [floorScore, setFloorScore] = useState('');

    const [rows, setRows] = useState([]);

    const [hideAdd, setHideAdd] = useState(true);
    const [hideEdit, setHideEdit] = useState(true);
    const [hideDelete, setHideDelete] = useState(true);

    const [years, setYears] = useState([]);
    const [levels, setLevels] = useState([]);

    const [hasExcel, setHasExcel] = useState(false);
    const [hasJO, setHasJO] = useState(false);

    const [avgVault, setAvgVault] = useState('');
    const [avgBar, setAvgBar] = useState('');
    const [avgBeam, setAvgBeam] = useState('');
    const [avgFloor, setAvgFloor] = useState('');
    const [avgTotal, setAvgTotal] = useState('');

    const [topVault, setTopVault] = useState('');
    const [topBars, setTopBars] = useState('');
    const [topBeam, setTopBeam] = useState('');
    const [topFloor, setTopFloor] = useState('');
    const [topTotal, setTopTotal] = useState('');

    /*
    * Name: addEntry
    * Input: onClick event
    * Output: N/A
    * Purpose: Collect data for new entry, send it to server, send updated data from server to be displayed
    */
    async function addEntry(event) {
        event.preventDefault();

        // send object to server with the proper data format
        const json = {"compInfo": compInfo, "year": year, "program": program, "level": level, "vaultScore": vaultScore, "barScore": barScore, "beamScore": beamScore, "floorScore": floorScore},
            body = JSON.stringify(json)

        const response = await fetch("/api/submit", {
            method: "POST",
            body
        })

        // wait for response from server
        const appdata = await response.text()

        const data = JSON.parse(appdata)

        // send data sent from server to be displayed and reset the form
        setHideAdd(true)
        parseData(data)
        clearForm()
    }

    /*
    * Name: delEntry
    * Input: onClick event
    * Output: N/A
    * Purpose: Collect data for entry to be deleted, send data to server, send updated data from server to be displayed
    */
    async function delEntry(event) {
        event.preventDefault();

        const body = JSON.stringify(id)

        // send ID to server
        const response = await fetch("/api/submit", {
            method: "POST",
            body
        })

        // wait for response from server
        const appdata = await response.text()

        const data = JSON.parse(appdata)

        // send data sent from server to be displayed and reset the form
        setHideDelete(true)
        parseData(data)
        setId('')
    }

    /*
    * Name: editEntry
    * Input: onClick event
    * Output: N/A
    * Purpose: Collect data for entry to be updated, send data to server, send updated data from server to be displayed
    */
    async function editEntry(event) {
        event.preventDefault();

        // send object to server with the proper data format
        const json = {"id": id, "compInfo": compInfo, "year": year, "program": program, "level": level, "vaultScore": vaultScore, "barScore": barScore, "beamScore": beamScore, "floorScore": floorScore},
            body = JSON.stringify(json)

        const response = await fetch("/api/submit", {
            method: "POST",
            body
        })

        // wait for response from server
        const appdata = await response.text()

        const data = JSON.parse(appdata)

        // send data sent from server to be displayed, reset the form, swap to AddEntry form
        setHideEdit(true)
        parseData(data)
        clearForm()
    }

    /*
    * Name: clearEntryForm
    * Input: N/A
    * Output: N/A
    * Purpose: clear add form
    */
    const clearForm = () => {
        setId('');
        setCompInfo('');
        setYear('');
        setProgram('');
        setLevel('');
        setVaultScore('');
        setBarScore('');
        setBeamScore('');
        setFloorScore('');

        document.getElementById('excel').checked = false
        document.getElementById('jo').checked = false

        document.getElementById('bronze').checked = false
        document.getElementById('silver').checked = false
        document.getElementById('gold').checked = false
        document.getElementById('platinum').checked = false
        document.getElementById('diamond').checked = false
        document.getElementById('sapphire').checked = false
    }

    /*
    * Name: swapForm
    * Input: name of form to be displayed, data object for edit form (if applicable)
    * Output: N/A
    * Purpose: Swap what form is being displayed
    */
    const swapForm = (form, prefillData) => {
        // hide other forms and display the proper one
        if (form === "addForm") {
            setHideAdd(false)
            setHideDelete(true)
            setHideEdit(true)
            clearForm()
        } else if (form === "delForm") {
            setHideAdd(true)
            setHideDelete(false)
            setHideEdit(true)
            setId('')
        } else if (form === "editForm") {
            setHideAdd(true)
            setHideDelete(true)
            setHideEdit(false)
            prefillEdit(prefillData); // send edit data to be prefilled into form
        }
    }

    /*
    * Name: prefillEdit
    * Input: object with data to be put into form
    * Output: N/A
    * Purpose: Prefill edit form with existing data in the entry
    */
    const prefillEdit = (info) => {
        // assign each form element the corresponding value from the current data entry
        setId(info.id)
        setCompInfo(info.compInfo)
        setYear(info.year)
        setProgram(info.program)
        setLevel(info.level)
        setVaultScore(info.vaultScore)
        setBarScore(info.barScore)
        setBeamScore(info.beamScore)
        setFloorScore(info.floorScore)
    }

    const parseData = (data) => {
        let newRows = []
        let currYears = []
        let currLevels = []

        data.forEach((item) => {
            let entry = {
                id: item.id,
                compInfo: item.compInfo,
                year: item.year,
                program: item.program,
                level: item.level,
                vaultScore: item.vaultScore,
                barScore: item.barScore,
                beamScore: item.beamScore,
                floorScore: item.floorScore,
                totalScore: item.totalScore,
                editButton: item,
            }

            if(item.program === "Excel") {
                setHasExcel(true);
            }

            if(item.program === "JO") {
                setHasJO(true);
            }

            newRows.push(entry)

            if (!currYears.includes(item.year)) {
                currYears.push(item.year)
            }

            if (!currLevels.includes(item.level)) {
                currLevels.push(item.level)
            }
        })

        setRows(newRows)
        currYears.sort()
        setYears(currYears)
        currLevels.sort()
        setLevels(currLevels)
        resetAnalytics()
    }

    const resetAnalytics = () => {
        const select = document.getElementById('filter')
        select.value = "All"
        runAnalytics("All")
    }

    async function runAnalytics(filter) {
        let body

        if (filter === "All") {
            body = JSON.stringify(filter)
        } else if (years.includes(filter)) {
            const json = {year: filter}
            body = JSON.stringify(json)
        } else if (levels.includes(filter)) {
            const json = {level: filter}
            body = JSON.stringify(json)
        } else if ((filter === "Excel") || (filter === "JO")) {
            const json = {program: filter}
            body = JSON.stringify(json)
        } else {
            body = JSON.stringify("Error")
        }

        const response = await fetch("/api/analytics", {
            method: "POST",
            body
        })

        const appdata = await response.text()

        const data = JSON.parse(appdata)

        let aVault = 0;
        let aBar = 0;
        let aBeam = 0;
        let aFloor = 0;
        let aTotal = 0;

        let tVault = 0;
        let tBar = 0;
        let tBeam = 0;
        let tFloor = 0;
        let tTotal = 0;

        let num = 0;

        data.forEach((item) => {
            aVault += Number(item.vaultScore)
            aBar += Number(item.barScore)
            aBeam += Number(item.beamScore)
            aFloor += Number(item.floorScore)
            aTotal += Number(item.totalScore)
            num++

            if (Number(item.vaultScore) > tVault) { tVault = Number(item.vaultScore) }
            if (Number(item.barScore) > tBar) { tBar = Number(item.barScore) }
            if (Number(item.beamScore) > tBeam) { tBeam = Number(item.beamScore) }
            if (Number(item.floorScore) > tFloor) { tFloor = Number(item.floorScore) }
            if (Number(item.totalScore) > tTotal) { tTotal = Number(item.totalScore) }
        })

        setAvgVault(`${Math.round(aVault/num * 1000) / 1000}`)
        setAvgBar(`${Math.round(aBar/num * 1000) / 1000}`)
        setAvgBeam(`${Math.round(aBeam/num * 1000) / 1000}`)
        setAvgFloor(`${Math.round(aFloor/num * 1000) / 1000}`)
        setAvgTotal(`${Math.round(aTotal/num * 1000) / 1000}`)

        setTopVault(`${tVault}`)
        setTopBars(`${tBar}`)
        setTopBeam(`${tBeam}`)
        setTopFloor(`${tFloor}`)
        setTopTotal(`${tTotal}`)
    }

    return <main className="formAndEntries flex-c justify-center items-center">
        <p className="text-[22px] mb-4 mx-30"><strong>Welcome {name} to your personal score tracker!</strong> You can add and delete
            competitions by clicking on the buttons below and filling out the forms. All competitions added will be
            displayed in the table below. The "Edit Entry" button, will open a form that will update the entry shown in that row.</p>

        <div className={'flex flex-wrap justify-center mt-8'}>
            <section className={'flex-c'}>
                <h3 className={'font-bold text-2xl'}>Competition Entries</h3>
                <div className="formControl mb-4 flex justify-center">
                    {hideAdd ?
                        <button id="addEntry" className="bg-yellow-400 p-2 me-2 rounded-xl font-bold hover:bg-yellow-500" onClick={() => swapForm("addForm")}>Add Entry</button> :
                        <button id="closeAdd" className="text-white bg-blue-500 p-2 me-2 rounded-xl font-bold hover:bg-blue-700" onClick={() => setHideAdd(true)}>Close Add</button>}
                    {hideDelete ?
                        <button id="delEntry" className="bg-yellow-400 p-2 ms-2 rounded-xl font-bold hover:bg-yellow-500" onClick={() => swapForm("delForm")}>Delete Entry</button> :
                        <button id="delEntry" className="text-white bg-blue-500 p-2 ms-2 rounded-xl font-bold hover:bg-blue-700" onClick={() => setHideDelete(true)}>Close Delete</button>}
                </div>
                <div className={'flex justify-center'}>
                    <form id="addForm" className="bg-yellow-400/25 p-4 rounded-xl mt-2" hidden={hideAdd}>
                        <div className="sectionHeader">
                            <h4 className={'font-bold text-xl pb-1'}>Add Entry Form</h4>
                        </div>

                        <label htmlFor="compInfo">1. Enter the Name of the Competition:</label><br/>
                        <p className={'ms-3'}>(ex. Competition Classic)</p>
                        <input type="text" id="compInfo" className="mt-1 mb-4 ms-3 border-1 rounded-md p-1 bg-yellow-50 focus:outline-[#001CB6]" name="compInfo" value={compInfo} onChange={ (e) => setCompInfo(e.target.value) }/><br/>

                        <label htmlFor={"year"}>2. Enter the Year of the Competition:</label><br />
                        <input type="number" id="year" className={'mt-1 mb-4 ms-3 border-1 rounded-md p-1 bg-yellow-50 focus:outline-[#001CB6]'} name="year" value={year} onChange={ (e) => setYear(e.target.value)}/><br />

                        <label>3. Enter the Program Competed Under:</label><br />
                        <input className={"mb-2 ms-4 mb-4"} type="radio" name="program" id="excel" value="Excel" onChange={ (e) => setProgram(e.target.value) } />
                        <label className={"ps-1 mb-2 mb-4"} htmlFor={"excel"}>Excel</label>
                        <input className={"mb-2 ms-2 mb-4"} type="radio" name="program" id="jo" value="JO" onChange={ (e) => setProgram(e.target.value) } />
                        <label className={"ps-1 mb-2 mb-4"} htmlFor={"jo"}>Junior Olympics (JO)</label><br />

                        <label>4. Select the Level Competed:</label><br/>
                        { (program === "Excel") ?
                            <div>
                                <input className="mb-2 ms-4" type="radio" name="level" id="bronze" value="Bronze" onChange={ (e) => setLevel(e.target.value) }/>
                                <label className="ps-1 mb-2" htmlFor="bronze">Bronze</label>
                                <input className="mb-2 ms-2" type="radio" name="level" id="silver" value="Silver" onChange={ (e) => setLevel(e.target.value) }/>
                                <label className="ps-1 mb-2" htmlFor="silver">Silver</label>
                                <input className="mb-2 ms-2" type="radio" name="level" id="gold" value="Gold" onChange={ (e) => setLevel(e.target.value) }/>
                                <label className="ps-1 mb-2" htmlFor="gold">Gold</label><br/>
                                <input className="mb-4 ms-4" type="radio" name="level" id="platinum" value="Platinum" onChange={ (e) => setLevel(e.target.value) }/>
                                <label className="ps-1 mb-4" htmlFor="platinum">Platinum</label>
                                <input className="mb-4 ms-2" type="radio" name="level" id="diamond" value="Diamond" onChange={ (e) => setLevel(e.target.value) }/>
                                <label className="ps-1 mb-4" htmlFor="diamond">Diamond</label>
                                <input className="mb-4 ms-2" type="radio" name="level" id="sapphire" value="Sapphire" onChange={ (e) => setLevel(e.target.value) }/>
                                <label className="ps-1 mb-4" htmlFor="sapphire">Sapphire</label>
                            </div>
                        : ( (program === "JO") ?
                                <div>
                                    <input className="ms-4 mb-2" type="radio" name="level" id="2" value="2" onChange={ (e) => setLevel(e.target.value) }/>
                                    <label className="ps-1 mb-2" htmlFor="2">2</label>
                                    <input className="ms-2 mb-2" type="radio" name="level" id="3" value="3" onChange={ (e) => setLevel(e.target.value) }/>
                                    <label className="ps-1 mb-2" htmlFor="3">3</label>
                                    <input className="ms-2 mb-2" type="radio" name="level" id="4" value="4" onChange={ (e) => setLevel(e.target.value) }/>
                                    <label className="ps-1 mb-2" htmlFor="4">4</label>
                                    <input className="ms-2 mb-2" type="radio" name="level" id="5" value="5" onChange={ (e) => setLevel(e.target.value) }/>
                                    <label className="ps-1 mb-2" htmlFor="5">5</label>
                                    <input className="ms-2 mb-2" type="radio" name="level" id="6" value="6" onChange={ (e) => setLevel(e.target.value) }/>
                                    <label className="ps-1 mb-2" htmlFor="6">6</label><br />
                                    <input className="ms-8 mb-3" type="radio" name="level" id="7" value="7" onChange={ (e) => setLevel(e.target.value) }/>
                                    <label className="ps-1 mb-3" htmlFor="7">7</label>
                                    <input className="ms-2 mb-3" type="radio" name="level" id="8" value="8" onChange={ (e) => setLevel(e.target.value) }/>
                                    <label className="ps-1 mb-3" htmlFor="8">8</label>
                                    <input className="ms-2 mb-3" type="radio" name="level" id="9" value="9" onChange={ (e) => setLevel(e.target.value) }/>
                                    <label className="ps-1 mb-3" htmlFor="9">9</label>
                                    <input className="ms-2 mb-3" type="radio" name="level" id="10" value="10" onChange={ (e) => setLevel(e.target.value) }/>
                                    <label className="ps-1 mb-3" htmlFor="10">10</label>
                                </div>
                            :
                                <div className={'p-2'}></div>
                            )
                        }

                        <label>5. Enter the Four Individual Event Scores:</label><br/>
                        <p className={'ms-3'}>(can have up to three decimal points, ex. 9.125)</p>
                        <div className="scores">
                            <label className="ms-2 mb-5 me-1" htmlFor="vaultScore">Vault:</label>
                            <input className="mt-1 mb-1 border-1 rounded-md p-1 bg-yellow-50 focus:outline-[#001CB6] me-2" type="number" id="vaultScore" name="vaultScore" min="0" max="10" value={vaultScore} onChange={ (e) => setVaultScore(e.target.value) }/>

                            <label className="ms-2 mb-3 me-1" htmlFor="barScore">Bars:</label>
                            <input className="mt-1 mb-1 border-1 rounded-md p-1 bg-yellow-50 focus:outline-[#001CB6] me-2" type="number" id="barScore" name="barScore" min="0" max="10" value={barScore} onChange={ (e) => setBarScore(e.target.value) }/><br/>

                            <label className="ms-2 mb-3 me-1" htmlFor="beamScore">Beam:</label>
                            <input className="mt-1 border-1 rounded-md p-1 bg-yellow-50 focus:outline-[#001CB6] me-2" type="number" id="beamScore" name="beamScore" min="0" max="10" value={beamScore} onChange={ (e) => setBeamScore(e.target.value) }/>

                            <label className="ms-2 mb-3 me-1" htmlFor="floorScore">Floor:</label>
                            <input className="mt-1 border-1 rounded-md p-1 bg-yellow-50 focus:outline-[#001CB6] me-2" type="number" id="floorScore" name="floorScore" min="0" max="10" value={floorScore} onChange={ (e) => setFloorScore(e.target.value) }/><br/>
                        </div>

                        <br/>
                        <button id="addSubmit" type="submit" className="me-2 p-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-700" onClick={addEntry}>Submit</button>
                        <button id="clearForm" type="button" className="bg-yellow-400 p-2 rounded-xl font-bold hover:bg-yellow-500" onClick={clearForm}>Clear</button>
                    </form>
                </div>

                <div className={'flex justify-center'}>
                    <form id="delForm" className="bg-yellow-400/25 p-4 rounded-xl mt-2" hidden={hideDelete}>
                        <div className="sectionHeader">
                            <h4 className={'font-bold text-xl pb-1'}>Delete Entry Form</h4>
                        </div>

                        <label htmlFor="toDel">Enter the Number(#) of the Entry You Would Like to Delete<br/>(Entry number can be
                            found in the first column of the table below)</label><br/>
                        <input type="number" id="toDel" className="mt-2 border-1 rounded-md p-1 bg-yellow-50 focus:outline-[#001CB6]" name="toDel" min="1" value={id} onChange={ (e) => setId(e.target.value) }/><br/>

                        <button id="delSubmit" type="submit" className="mt-4 p-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-700" onClick={delEntry}>Delete</button>
                    </form>
                </div>

                <div className={'flex justify-center'}>
                    <form id="editForm" className="bg-yellow-400/25 p-4 rounded-xl mt-2" hidden={hideEdit}>
                        <div className="sectionHeader mb-3">
                            <h4 className={'font-bold text-xl pb-1'}>Edit Entry Form</h4>
                            <p>Update fields below and save to edit entry.</p>
                        </div>

                        <label htmlFor="num">Entry Number (Display Only, Cannot Edit)</label><br/>
                        <input type="number" id="num" className="mt-1 mb-4 ms-2 border-1 rounded-md p-1 bg-yellow-50 focus:outline-[#001CB6]" name="num" value={id} readOnly/><br/>

                        <label htmlFor="editComp">Name of the Competition:</label><br/>
                        <input type="text" id="editComp" className="mt-1 mb-4 ms-2 border-1 rounded-md p-1 bg-yellow-50 focus:outline-[#001CB6]" name="editComp" value={compInfo} onChange={ (e) => setCompInfo(e.target.value) }/><br/>

                        <label htmlFor={"year"}>Year of the Competition:</label><br />
                        <input type="number" id="year" className={'mt-1 mb-4 ms-3 border-1 rounded-md p-1 bg-yellow-50 focus:outline-[#001CB6]'} name="year" value={year} onChange={ (e) => setYear(e.target.value)}/><br />

                        <label>Program Competed Under:</label><br />
                        <input className={"mb-2 ms-4 mb-4"} type="radio" name="editProgram" id="editExcel" value="Excel" checked={program === "Excel"} onChange={ (e) => setProgram(e.target.value) } />
                        <label className={"ps-1 mb-2 mb-4"} htmlFor={"editExcel"}>Excel</label>
                        <input className={"mb-2 ms-2 mb-4"} type="radio" name="editProgram" id="editJO" value="JO" checked={program === "JO"} onChange={ (e) => setProgram(e.target.value) } />
                        <label className={"ps-1 mb-2 mb-4"} htmlFor={"editJO"}>Junior Olympics (JO)</label><br />

                        <label>Level Competed:</label><br/>
                        { (program === "Excel") ?
                            <div>
                                <input className="form-check-input mb-1 ms-2" type="radio" name="editLevel" id="editBronze" value="Bronze" checked={level === "Bronze"} onChange={ (e) => setLevel(e.target.value) }/>
                                <label className="form-check-label ps-1 mb-1" htmlFor="editBronze">Bronze</label>
                                <input className="form-check-input mb-1 ms-2" type="radio" name="editLevel" id="editSilver" value="Silver" checked={level === "Silver"} onChange={ (e) => setLevel(e.target.value) }/>
                                <label className="form-check-label ps-1 mb-1" htmlFor="editSilver">Silver</label>
                                <input className="form-check-input mb-1 ms-2" type="radio" name="editLevel" id="editGold" value="Gold" checked={level === "Gold"} onChange={ (e) => setLevel(e.target.value) }/>
                                <label className="form-check-label ps-1 mb-1" htmlFor="editGold">Gold</label><br/>
                                <input className="form-check-input mb-4 ms-2" type="radio" name="editLevel" id="editPlatinum" value="Platinum" checked={level === "Platinum"} onChange={ (e) => setLevel(e.target.value) }/>
                                <label className="form-check-label ps-1 mb-4" htmlFor="editPlatinum">Platinum</label>
                                <input className="form-check-input mb-4 ms-4" type="radio" name="editLevel" id="editDiamond" value="Diamond" checked={level === "Diamond"} onChange={ (e) => setLevel(e.target.value) }/>
                                <label className="form-check-label ps-1 mb-4" htmlFor="editDiamond">Diamond</label>
                                <input className="form-check-label mb-4 ms-2" type="radio" name="editLevel" id="editSapphire" value="Sapphire" checked={level === "Sapphire"} onChange={ (e) => setLevel(e.target.value) }/>
                                <label className="ps-1 mb-4" htmlFor="sapphire">Sapphire</label>
                            </div>
                        : ( (program === "JO") ?
                                <div>
                                    <input className="ms-4 mb-2" type="radio" name="editLevel" id="edit2" value="2" checked={level === "2"} onChange={ (e) => setLevel(e.target.value) }/>
                                    <label className="ps-1 mb-2" htmlFor="edit2">2</label>
                                    <input className="ms-2 mb-2" type="radio" name="editLevel" id="edit3" value="3" checked={level === "3"} onChange={ (e) => setLevel(e.target.value) }/>
                                    <label className="ps-1 mb-2" htmlFor="edit3">3</label>
                                    <input className="ms-2 mb-2" type="radio" name="editLevel" id="edit4" value="4" checked={level === "4"} onChange={ (e) => setLevel(e.target.value) }/>
                                    <label className="ps-1 mb-2" htmlFor="edit4">4</label>
                                    <input className="ms-2 mb-2" type="radio" name="editLevel" id="edit5" value="5" checked={level === "5"} onChange={ (e) => setLevel(e.target.value) }/>
                                    <label className="ps-1 mb-2" htmlFor="edit5">5</label>
                                    <input className="ms-2 mb-2" type="radio" name="editLevel" id="edit6" value="6" checked={level === "6"} onChange={ (e) => setLevel(e.target.value) }/>
                                    <label className="ps-1 mb-2" htmlFor="edit6">6</label><br />
                                    <input className="ms-8 mb-3" type="radio" name="editLevel" id="edit7" value="7" checked={level === "7"} onChange={ (e) => setLevel(e.target.value) }/>
                                    <label className="ps-1 mb-3" htmlFor="edit7">7</label>
                                    <input className="ms-2 mb-3" type="radio" name="editLevel" id="edit8" value="8" checked={level === "8"} onChange={ (e) => setLevel(e.target.value) }/>
                                    <label className="ps-1 mb-3" htmlFor="edit8">8</label>
                                    <input className="ms-2 mb-3" type="radio" name="editLevel" id="edit9" value="9" checked={level === "9"} onChange={ (e) => setLevel(e.target.value) }/>
                                    <label className="ps-1 mb-3" htmlFor="edit9">9</label>
                                    <input className="ms-2 mb-3" type="radio" name="editLevel" id="edit10" value="10" checked={level === "10"} onChange={ (e) => setLevel(e.target.value) }/>
                                    <label className="ps-1 mb-3" htmlFor="edit10">10</label>
                                </div>
                            :
                                <div className='p-2'></div>
                            )
                        }
                        <br/>

                        <label>Scores:</label><br/>
                        <div className="scores">
                            <label className="ms-2 mb-3 me-1" htmlFor="editVault">Vault:</label>
                            <input className="mt-1 mb-2 border-1 rounded-md p-1 bg-yellow-50 focus:outline-[#001CB6]" type="number" id="editVault" name="vaultScore" min="0" max="10" value={vaultScore} onChange={ (e) => setVaultScore(e.target.value) }/>

                            <label className="ms-2 mb-3 me-1" htmlFor="editBars">Bars:</label>
                            <input className="mt-1 mb-2 border-1 rounded-md p-1 bg-yellow-50 focus:outline-[#001CB6]" type="number" id="editBars" name="barScore" min="0" max="10" value={barScore} onChange={ (e) => setBarScore(e.target.value) }/><br/>

                            <label className="ms-2 mb-3 me-1" htmlFor="editBeam">Beam:</label>
                            <input className={'border-1 rounded-md p-1 bg-yellow-50 focus:outline-[#001CB6]'} type="number" id="editBeam" name="beamScore" min="0" max="10" value={beamScore} onChange={ (e) => setBeamScore(e.target.value) }/>

                            <label className="ms-2 mb-3 me-1" htmlFor="editFloor">Floor:</label>
                            <input className={'border-1 rounded-md p-1 bg-yellow-50 focus:outline-[#001CB6]'} type="number" id="editFloor" name="floorScore" min="0" max="10" value={floorScore} onChange={ (e) => setFloorScore(e.target.value) }/><br/>
                        </div>

                        <button id="editSubmit" type="submit" className="mt-4 me-2 p-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-700" onClick={editEntry}>Save</button>
                        <button id={'closeEdit'} className={'mt-4 bg-yellow-400 p-2 rounded-xl font-bold hover:bg-yellow-500'} onClick={() => setHideEdit(true)}>Close</button>
                    </form>
                </div>

                <div id="entries">
                    <div className="sectionHeader pt-5">
                        <h4 className={'font-bold text-xl'}>Entry Table</h4>
                    </div>

                    <div className="pt-3 pb-5 flex-col w-full">
                        <StripedDataGrid
                            getRowHeight={() => 'auto'}
                            rows={rows}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 10,
                                    },
                                },
                            }}
                            pageSizeOptions={[5, 10, 20]}
                            getRowClassName={(params) =>
                                params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                            }
                            sx={{
                                '& .MuiDataGrid-main': {
                                    width: 'fit-content',
                                },
                            }}
                            showToolbar
                        />
                    </div>
                </div>
            </section>

            <aside className={'flex-c ps-5 ms-10'}>
                <h3 className={'text-2xl font-bold mb-3 text-center'}>Analytics</h3>

                <div className="flex justify-center mb-2">
                    <label htmlFor="filter" className={'me-2 mt-1.5'}>For:</label>
                    <select id="filter" name="filter" className={'border-1 rounded-md bg-yellow-50 p-1 focus:outline-[#001CB6]'} onChange={ (e) => runAnalytics(e.target.value) }>
                        <option key="all" value={"All"}>All Entries</option>
                        { (hasExcel && hasJO) ?
                                <optgroup label={"Program"}>
                                    <option key="Excel" value={"Excel"}>Excel</option>
                                    <option key={"JO"} value={"JO"}>JO</option>
                                </optgroup>
                            :
                                null
                        }
                        <optgroup label={"Level"}>
                            {levels.map((level) => {
                                return <option key={level} value={level}>{level}</option>
                            })}
                        </optgroup>
                        <optgroup label={"Year"}>
                            {years.map((year) => {
                                return <option key={year} value={year}>{year}</option>
                            })}
                        </optgroup>
                    </select>
                </div>


                <div className={'flex'}>
                    <div className={'flex-c me-8'}>
                        <h4 className={'mx-2 text-xl font-bold'}>Average:</h4>
                        <div className={'bg-[#fcc800]/25 p-2 mx-1 mb-3 rounded-xl'}>
                            <h4 className={'text-center font-bold text-xl'}>Vault Score</h4>
                            <p className={'text-center text-2xl'}>{avgVault}</p>
                        </div>

                        <div className={'bg-[#c8b640]/25 p-2 mx-1 my-3 rounded-xl'}>
                            <h4 className={'text-center font-bold text-xl'}>Bars Score</h4>
                            <p className={'text-center text-2xl'}>{avgBar}</p>
                        </div>

                        <div className={'bg-[#94a480]/25 p-2 mx-1 my-3 rounded-xl'}>
                            <h4 className={'text-center font-bold text-xl'}>Beam Score</h4>
                            <p className={'text-center text-2xl'}>{avgBeam}</p>
                        </div>

                        <div className={'bg-[#6092c0]/25 p-2 mx-1 my-3 rounded-xl'}>
                            <h4 className={'text-center font-bold text-xl'}>Floor Score</h4>
                            <p className={'text-center text-2xl'}>{avgFloor}</p>
                        </div>

                        <div className={'bg-[#2b7fff]/25 p-2 mx-1 my-3 rounded-xl'}>
                            <h4 className={'text-center font-bold text-xl'}>Total Score:</h4>
                            <p className={'text-center text-2xl'}>{avgTotal}</p>
                        </div>
                    </div>

                    <div className={'me-8'}>
                        <img src="src/assets/table.png" className="max-h-[90px] mt-8" alt="Vault Table Icon" />
                        <img src="src/assets/bars.png" className="max-h-[90px] mt-3" alt="Bars Icon" />
                        <img src="src/assets/beam.png" className="max-h-[90px] mt-1" alt="Beam Icon" />
                        <img src="src/assets/floor.png" className="max-h-[75px] ms-1.5 mt-3" alt="Floor Icon" />
                        <img src="src/assets/medal.png" className="max-h-[80px] ms-1.5 mt-5" alt="Medal Icon" />
                    </div>

                    <div className={'flex-c'}>
                        <h4 className={'mx-2 text-xl font-bold text-end'}>Top Scores:</h4>
                        <div className={'bg-[#fcc800]/25 p-2 mx-1 mb-3 rounded-xl'}>
                            <h4 className={'text-center font-bold text-xl'}>Vault Score</h4>
                            <p className={'text-center text-2xl'}>{topVault}</p>
                        </div>

                        <div className={'bg-[#c8b640]/25 p-2 mx-1 my-3 rounded-xl'}>
                            <h4 className={'text-center font-bold text-xl'}>Bars Score</h4>
                            <p className={'text-center text-2xl'}>{topBars}</p>
                        </div>

                        <div className={'bg-[#94a480]/25 p-2 mx-1 my-3 rounded-xl'}>
                            <h4 className={'text-center font-bold text-xl'}>Beam Score</h4>
                            <p className={'text-center text-2xl'}>{topBeam}</p>
                        </div>

                        <div className={'bg-[#6092c0]/25 p-2 mx-1 my-3 rounded-xl'}>
                            <h4 className={'text-center font-bold text-xl'}>Floor Score</h4>
                            <p className={'text-center text-2xl'}>{topFloor}</p>
                        </div>

                        <div className={'bg-[#2b7fff]/25 p-2 mx-1 my-3 rounded-xl'}>
                            <h4 className={'text-center font-bold text-xl'}>Total Score:</h4>
                            <p className={'text-center text-2xl'}>{topTotal}</p>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    </main>;
}

export default App
