export interface Events<MetaType = any>{
    id?: string ;
    start: Date;
    end?: Date;
    title: string;
    userId?:string;
    userName?:string;
    userEmailId?:string;
    adminId?:string;
    adminUserName?:string;
    primaryColor?;
    event?:Events<MetaType>;
    newStart?:Date;
    newEnd?:Date;
    secondaryColor?;
    actions?;
    allDay?: boolean;
    cssClass?: string;
    resizable?: {
        beforeStart?: boolean;
        afterEnd?: boolean;
    };
    draggable?: boolean;
    meta?;
}
export interface EventAc {
    label: string;
    cssClass?: string;
    onClick({ event }: {
        event: Events;
    }): any;
}