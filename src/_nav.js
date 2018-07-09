export default {
  items: [
    {
      name: 'general.dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
      badge: {
        variant: 'primary',
        text: 'NEW'
      }
    },
    {
      name: 'tax.notification_to_ird',
      url: '/ird_forms',
      icon: 'fa fa-file-text',
      children: [
        {
          name: 'tax.employee_commencement',
          url: '/employee_commencement',
          icon: 'fa fa-file-text'
        },
        {
          name: 'tax.employee_termination',
          url: '/employee_termination',
          icon: 'fa fa-file-text'
        },
        {
          name: 'tax.employee_departure_from_hk',
          url: '/employee_departure',
          icon: 'fa fa-file-text'
        },
        {
          name: 'tax.employee_salary',
          url: '/employee_salary',
          icon: 'fa fa-file-text'
        }
      ]
    },
    {
      name: 'tax.tax_forms',
      url: '/tax_forms',
      icon: 'fa fa-file-text',
      badge: {}
    },
    {
      name: 'mpf.mpf_management',
      url: '/mpf_management',
      icon: 'fa fa-dollar',
      badge: {}
    }

  ]
}
