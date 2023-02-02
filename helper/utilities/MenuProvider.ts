export default function (role : 'admin' | 'manajer' | 'karyawan') {
    let appMenu = [
        { isParent: false, text: 'Home', icon: 'mdi-home', url: '/'},
        { isParent: true, text: 'Lembur', icon: 'mdi-chart-box-plus-outline', children : [
                { text: 'Pengajuan Lembur', url: '/overtime/submission'}
            ]
        },
        { isParent: true, text: 'Cuti', icon: 'mdi-account-arrow-left', children : [
                { text: 'Pengajuan Cuti', url: '/leave/submission'}
            ]
        },
    ]

    switch (role) {
        case 'admin':
            appMenu = [
                { isParent: false, text: 'Home', icon: 'mdi-home', url: '/'},
                { isParent: true, text: 'Lembur', icon: 'mdi-chart-box-plus-outline', children : [
                        { text: 'Pengajuan Lembur', url: '/overtime/submission'},
                        // { text: 'Lembur Karyawan', url: '/overtime/manager'}
                    ]
                },
                { isParent: true, text: 'Cuti', icon: 'mdi-account-arrow-left', children : [
                        { text: 'Pengajuan Cuti', url: '/leave/submission'},
                        // { text: 'Cuti Karyawan', url: '/overtime/manager'}
                    ]
                },
                { isParent: true, text: 'Gaji Karyawan', icon: 'mdi-file-document-check-outline', children : [
                        { text: 'Kelola Gaji', url: '/salary/manage'},
                        // { text: 'Arsip Gaji', url: '/salary/archieve'},
                    ]
                },
                { isParent: false, text: 'Data Karyawan', icon: 'mdi-account', url: '/employe'},
                { isParent: true, text: 'Master Data', icon: 'mdi-folder', children : [
                        { text: 'Master Jabatan', url: '/master-data/jabatan'},
                        { text: 'Master Tunjangan', url: '/master-data/tunjangan'},
                        { text: 'Master Potongan', url: '/master-data/potongan'},
                    ]
                },
            ]
        break;
        case 'manajer':
            appMenu = [
                { isParent: false, text: 'Home', icon: 'mdi-home', url: '/'},
                { isParent: true, text: 'Lembur', icon: 'mdi-chart-box-plus-outline', children : [
                        { text: 'Pengajuan Lembur', url: '/overtime/submission'},
                        { text: 'Lembur Karyawan', url: '/overtime/manager'}
                    ]
                },
                { isParent: true, text: 'Cuti', icon: 'mdi-account-arrow-left', children : [
                        { text: 'Pengajuan Cuti', url: '/leave/submission'},
                        { text: 'Cuti Karyawan', url: '/leave/manager'}
                    ]
                },
                { isParent: true, text: 'Laporan', icon: 'mdi-file', children : [
                        { text: 'Laporan Gaji', url: '/report/salary-report'},
                        { text: 'Laporan Cuti', url: '/report/leave-report'},
                        { text: 'Laporan Lembur', url: '/report/overtime-report'}
                    ]
                },
            ]
        break;
    }

    return appMenu
}