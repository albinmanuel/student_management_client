import { commonAPI } from "../Services/commonAPI";
import { serverUrl } from "../Services/serverURL";

export const loginAPI = async (reqBody) => {
    return await commonAPI('post', `${serverUrl}/api/login`, reqBody);
}

export const createStaffAPI = async (reqBody, reqHeader) => {
    return await commonAPI('post', `${serverUrl}/api/addstaff`, reqBody, reqHeader)
}

export const getAllStaffsAPI=async(reqHeader)=>{
    return await commonAPI('get',`${serverUrl}/api/getallstaffs`,"",reqHeader)
}

export const updateStaffAPI=async(staffId,reqBody,reqHeader)=>{
    return await commonAPI('put',`${serverUrl}/api/updatestaff/${staffId}`,reqBody,reqHeader)
}

export const deleteStaffAPI=async(staffId,reqHeader)=>{
    return await commonAPI('delete',`${serverUrl}/api/deletestaff/${staffId}`,"",reqHeader)
}

export const updatePermissionsAPI = async (staffId, reqBody, reqHeader) => {
    return await commonAPI('put', `${serverUrl}/api/updatepermissions/${staffId}`, reqBody, reqHeader)
}

export const getPermissionsAPI = async (staffId, reqHeader) => {
    return await commonAPI('get', `${serverUrl}/api/getpermissions/${staffId}`, "", reqHeader)
}

export const createStudentAPI = async (reqBody, reqHeader) => {
    return await commonAPI('post', `${serverUrl}/api/addstudent`, reqBody, reqHeader)
}

export const getAllStudentsAPI = async (reqHeader) => {
    return await commonAPI('get', `${serverUrl}/api/getallstudents`, "", reqHeader)
}

export const updateStudentAPI = async (studentId, reqBody, reqHeader) => {
    return await commonAPI('put', `${serverUrl}/api/updatestudent/${studentId}`, reqBody, reqHeader)
}

export const deleteStudentAPI = async (studentId, reqHeader) => {
    return await commonAPI('delete', `${serverUrl}/api/deletestudent/${studentId}`, "", reqHeader)
}

export const createStudentByStaffAPI = async (reqBody, reqHeader) => {
    return await commonAPI('post', `${serverUrl}/api/createstudentbystaff`, reqBody, reqHeader)
}

export const getAllStudentsByStaffAPI = async (reqHeader) => {
    return await commonAPI('get', `${serverUrl}/api/getallstudentsbystaff`, "", reqHeader)
}

export const updateStudentByStaffAPI = async (studentId, reqBody, reqHeader) => {
    return await commonAPI('put', `${serverUrl}/api/updatestudentbystaff/${studentId}`, reqBody, reqHeader)
}

export const deleteStudentByStaffAPI = async (studentId, reqHeader) => {
    return await commonAPI('delete', `${serverUrl}/api/deletestudentbystaff/${studentId}`, "", reqHeader)
}

export const getParticularUserAPI=async(reqHeader)=>{
    return await commonAPI('get',`${serverUrl}/api/getparticularuser`,"",reqHeader)
}

export const getCountsAPI = async (reqHeader) => {
    return await commonAPI('get', `${serverUrl}/api/getcounts`, "", reqHeader)
}