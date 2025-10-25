class LanguageService {
  constructor() {
    this.currentLanguage = localStorage.getItem('language') || 'en'
    this.translations = {
      zh: {
        // App Navigation
        'system_title': '值班管理系统',
        'employees': '人员',
        'schedules': '排班',

        // Employees Page
        'all_employees': '所有员工',
        'employee_no': '序号',
        'full_name': '姓名',
        'age': '年龄',
        'position': '职位',
        'actions': '操作',
        'schedule': '排班',
        'add_employee': '添加员工',

        // Employee Form
        'add_employee_title': '添加员工',
        'select_position': '选择职位',
        'save_employee': '保存员工',
        'back': '返回',

        // Schedule Pages
        'employee_schedule': '员工排班',
        'schedule_for': '排班表:',
        'start_date': '开始日期',
        'end_date': '结束日期',
        'start_time': '开始时间',
        'end_time': '结束时间',
        'duration': '工作时长',
        'no_schedules_found': '该员工暂无排班记录。',
        'schedule_details_count': '排班详情 (共 {count} 条记录)',
        'add_new_schedule': '添加新排班',

        // Schedule Create
        'add_employee_schedule': '添加员工排班',
        'adding_schedule_for': '为以下员工添加排班:',
        'save_schedule': '保存排班',

        // Schedule Details
        'schedule_details_for': '{position} 排班详情',
        'working_time': '工作时间:',
        'employee_name': '员工姓名',
        'no_employees_found': '所选时间段内未找到员工。',
        'total_employees': '员工总数:',
        'back_to_schedule': '返回排班表',

        // Schedule Summary
        'schedule.summary': '排班汇总',
        'schedule.startDate': '开始日期',
        'schedule.endDate': '结束日期',
        'schedule.allPositions': '所有职位',
        'schedule.totalSchedules': '总排班数',
        'schedule.shiftTime': '班次时间 (每小时)',
        'schedule.noDataFound': '没有找到符合筛选条件的排班数据。',

        // Employee sections
        'employee.position': '职位',

        // Common
        'common.refresh': '刷新',
        'common.loading': '加载中...',
        'common.back': '返回',
        'common.save': '保存',
        'common.add': '添加',
        'common.actions': '操作',
        'common.search': '搜索',
        'common.holdCtrlToSelectMultiple': '按住 Ctrl 键可选择多个',
        'common.selected': '已选择',
        'common.selectAll': '全选',

        // Job Positions
        'position.DRIVER': '司机',
        'position.CHEF': '厨师',
        'position.WAITER': '服务员',
        'position.MANAGER': '经理',
        'position.CLEANER': '清洁员',
        'position.OPERATOR': '操作员',
        'position.TECHNICIAN': '技术员',
        'position.CUSTOMER_SERVICE': '客服',
        'position.SECURITY_GUARD': '保安'
      },
      en: {
        // App Navigation
        'system_title': 'Duty Management System',
        'employees': 'Employees',
        'schedules': 'Schedules',

        // Employees Page
        'all_employees': 'All Employees',
        'employee_no': 'No.',
        'full_name': 'Full Name',
        'age': 'Age',
        'position': 'Position',
        'actions': 'Actions',
        'schedule': 'Schedule',
        'add_employee': 'Add Employee',

        // Employee Form
        'add_employee_title': 'Add Employee',
        'select_position': 'Select Position',
        'save_employee': 'Save Employee',
        'back': 'Back',

        // Schedule Pages
        'employee_schedule': 'Employee Schedule',
        'schedule_for': 'Schedule for:',
        'start_date': 'Start Date',
        'end_date': 'End Date',
        'start_time': 'Start Time',
        'end_time': 'End Time',
        'duration': 'Duration',
        'no_schedules_found': 'No schedules found for this employee.',
        'schedule_details_count': 'Schedule Details ({count} entries)',
        'add_new_schedule': 'Add New Schedule',

        // Schedule Create
        'add_employee_schedule': 'Add Employee Schedule',
        'adding_schedule_for': 'Adding schedule for:',
        'save_schedule': 'Save Schedule',

        // Schedule Details
        'schedule_details_for': 'Schedule Details for {position}',
        'working_time': 'Working Time:',
        'employee_name': 'Employee Name',
        'no_employees_found': 'No employees found for the selected time period.',
        'total_employees': 'Total Employees:',
        'back_to_schedule': 'Back to Schedule',

        // Schedule Summary
        'schedule.summary': 'Schedule Summary',
        'schedule.startDate': 'Start Date',
        'schedule.endDate': 'End Date',
        'schedule.allPositions': 'All Positions',
        'schedule.totalSchedules': 'Total Schedules',
        'schedule.shiftTime': 'Shift Time (Hourly)',
        'schedule.noDataFound': 'No schedule data found for the selected filters.',

        // Employee sections
        'employee.position': 'Position',

        // Common
        'common.refresh': 'Refresh',
        'common.loading': 'Loading...',
        'common.back': 'Back',
        'common.save': 'Save',
        'common.add': 'Add',
        'common.actions': 'Actions',
        'common.search': 'Search',
        'common.holdCtrlToSelectMultiple': 'Hold Ctrl to select multiple',
        'common.selected': 'Selected',
        'common.selectAll': 'Select All',

        // Job Positions
        'position.DRIVER': 'Driver',
        'position.CHEF': 'Chef',
        'position.WAITER': 'Waiter',
        'position.MANAGER': 'Manager',
        'position.CLEANER': 'Cleaner',
        'position.OPERATOR': 'Operator',
        'position.TECHNICIAN': 'Technician',
        'position.CUSTOMER_SERVICE': 'Customer Service',
        'position.SECURITY_GUARD': 'Security Guard'
      }
    }
  }

  getCurrentLanguage() {
    return this.currentLanguage
  }

  setLanguage(language) {
    this.currentLanguage = language
    localStorage.setItem('language', language)
  }

  translate(key, params = {}) {
    let translation = this.translations[this.currentLanguage][key] || key

    // Replace parameters in translation
    Object.keys(params).forEach(param => {
      translation = translation.replace(`{${param}}`, params[param])
    })

    return translation
  }

  getJobPositions() {
    return [
      { value: 'DRIVER', label: this.translate('position.DRIVER') },
      { value: 'CHEF', label: this.translate('position.CHEF') },
      { value: 'WAITER', label: this.translate('position.WAITER') },
      { value: 'MANAGER', label: this.translate('position.MANAGER') },
      { value: 'CLEANER', label: this.translate('position.CLEANER') },
      { value: 'OPERATOR', label: this.translate('position.OPERATOR') },
      { value: 'TECHNICIAN', label: this.translate('position.TECHNICIAN') },
      { value: 'CUSTOMER_SERVICE', label: this.translate('position.CUSTOMER_SERVICE') },
      { value: 'SECURITY_GUARD', label: this.translate('position.SECURITY_GUARD') },
    ]
  }
}

export default new LanguageService()