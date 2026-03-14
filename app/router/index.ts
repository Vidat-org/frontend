import { listScanIssues } from "./issues"
import { getLatestScan, listWebsiteScans } from "./scans"
import {
  createWebsite,
  getWebsite,
  listWebsites,
  updateNextCheck,
} from "./website"

export const router = {
  listWebsites: listWebsites,
  createWebsite: createWebsite,
  getWebsite: getWebsite,
  listWebsiteScans: listWebsiteScans,
  updateWebsiteNextCheck: updateNextCheck,
  getLatestScan: getLatestScan,
  listScanIssues: listScanIssues,
}
