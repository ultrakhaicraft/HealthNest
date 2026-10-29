import { LinkRequestStatus } from "../feature/Constant";
import { PageinationParams } from "./ApiClientModel";

export interface StudentLinkRequestDetailModel extends StudentLinkRequestViewModel {
    relationshipNote: string;

    // Same: backend additions
    parentName?: string | null;
    reviewedByName?: string | null;
}

export interface StudentLinkRequestViewModel {
    id: string;
    parentId: string;
    studentId: string;
    studentName?: string | null;
    status: LinkRequestStatus;
    createdDateTime: string;
    reviewedBy?: string | null;
    reviewedDateTime?: string | null;
    rejectionReason?: string | null;

}

// --- Request models ---

export interface LinkRequestCreateModel {
    studentIds: string[];
    relationshipNote: string;             // required, max 500
}

export interface LinkRequestRejectModel {
    rejectionReason: string;              // required, shown to the parent
}

export interface StudentLookupQuery {
    email: string;
    dateOfBirth: string;                  // "yyyy-MM-dd", straight from <input type="date">
}


export interface StudentLinkRequestQuery extends PageinationParams {
    studentName?: string;
    parentName?: string;                  // nurse queue only
    status?: LinkRequestStatus | '';
}