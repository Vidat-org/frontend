import { listScanIssues } from "./issues"
import { getReportById, listReports } from "./reports"
import { getLatestScan, getScan, listWebsiteScans } from "./scans"
import {
  createWebsite,
  getWebsite,
  listWebsites,
  updateNextCheck,
  updateWebsiteDeviceType,
} from "./website"

export const router = {
  listWebsites: listWebsites,
  createWebsite: createWebsite,
  getWebsite: getWebsite,
  listWebsiteScans: listWebsiteScans,
  updateWebsiteNextCheck: updateNextCheck,
  updateWebsiteDeviceType: updateWebsiteDeviceType,
  getLatestScan: getLatestScan,
  listScanIssues: listScanIssues,
  getScan: getScan,

  listReports: listReports,
  getReportById: getReportById,
}
