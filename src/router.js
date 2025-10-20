import { createWebHistory, createRouter } from "vue-router";

const routes =  [
    {
        path: "/",
        redirect: "/employees"
    },
    {
        path: "/employees",
        name: "Employees",
        component: () => import("./components/Employees.vue"),
    },
    {
        path: "/employee/:id",
        name: "Employee",
        component: () => import("./components/Employee.vue"),
    },
    {
        path: "/employee/:id/schedule/add",
        name: "ScheduleCreate",
        component: () => import("./components/ScheduleCreate.vue"),
    },
    {
        path: "/employee/:id/schedule",
        name: "ScheduleView",
        component: () => import("./components/ScheduleView.vue"),
    },
    {
        path: "/schedules",
        name: "Schedules",
        component: () => import("./components/Schedules.vue"),
    },
    {
        path: "/schedule/details",
        name: "ScheduleDetails",
        component: () => import("./components/ScheduleDetails.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;