import axios from 'axios';

const ATTENDANCE_ENDPOINT = '/attendance'

export async function downloadTemplateImport () : Promise<any> {
    return await axios.get(`${ATTENDANCE_ENDPOINT}/download-template`, {
        headers:
        {
            'Content-Disposition': "attachment; filename=template.xlsx",
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        },
        responseType: 'arraybuffer',
    })
}

export async function getThisMonth () : Promise<Attendance[]> {
    const now = new Date()
    const { data } = await axios.get<System.ApiReponse<Attendance[]>>(`${ATTENDANCE_ENDPOINT}`, {
        params: {
            month: now.getMonth() + 1,
            year: now.getFullYear(),
        }
    })
    return data.data
}

export async function importAttendance (payload : { dayOfWork : string, fileImport: Blob}) : Promise<System.ApiReponse<null>> {
    const formData = new FormData()
    formData.append('dayOfWork', payload.dayOfWork )
    formData.append('fileImport', payload.fileImport )

    const { data } = await axios.post<System.ApiReponse<null>>(`${ATTENDANCE_ENDPOINT}/import`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })

    return data
}

type GetSavedDayOfWorkResp = {
    day_of_work : string
}
export async function getSavedDayOfWork () : Promise<GetSavedDayOfWorkResp> {
    const { data } = await axios.get<System.ApiReponse<GetSavedDayOfWorkResp>>(`${ATTENDANCE_ENDPOINT}/saved-day-of-work`)

    return data.data
}

const AttendanceAPI = { downloadTemplateImport, getThisMonth, importAttendance,getSavedDayOfWork }
export default AttendanceAPI