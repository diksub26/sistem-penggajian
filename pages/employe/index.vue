<template>
    <div style="d-contents">
        <v-data-table :headers="dataTableHeaders" :items="employees" height="100%" :loading="isLoading" :items-per-page="25" 
                :footer-props="{ 'items-per-page-options': [25, 50, -1] }"
            >
            <template v-slot:top>
                <v-toolbar flat>
                    <v-btn color="blue" dark depressed small class="text-none" @click="onClickAddBtn()"><v-icon>mdi-plus</v-icon> Tambah Data</v-btn>
                </v-toolbar>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class='mr-2' @click="onClickEditBtn(item)" color="green" title="Edit">mdi-pencil</v-icon>
                <v-icon small class='mr-2' @click="onClickShowBtn(item)" color="info" title="Detail">mdi-eye</v-icon>
                <v-icon small @click="onClickDeleteBtn(item)" color="error" title="Hapus">mdi-delete</v-icon>
            </template>
        </v-data-table>

        <!-- Dialog Form Employee -->
        <v-dialog v-model="isFormDialogOpen" width="1200px" persistent>
            <v-form ref="employeeForm" v-model="isFormDialogValid" lazy-validation @submit.prevent="onFormDialogSubmitted">
                <v-card :loading="isFormDialogLoading" :disabled="isFormDialogLoading">
                    <v-toolbar color="primary" dark dense elevation="0">Form Data Karyawan</v-toolbar>
                    <v-card-text>
                        <v-container fluid class="pa-0">
                            <v-row dense>
                                <v-col cols="4" class="px-2">
                                    <v-text-field label="No. Induk" v-model="selectedDataTableItem.noInduk" autofocus :rules="[inputFieldRequiredRules]" />
                                    <v-text-field label="Nama Lengkap" v-model="selectedDataTableItem.fullname" :rules="[inputFieldRequiredRules]" />
                                    <v-select label="Jenis Kelamin" v-model="selectedDataTableItem.gender" :items="[ { text: 'Laki-laki', value: 'L'}, { text: 'Perempuan', value: 'P'}]" 
                                        :rules="[inputFieldRequiredRules]"
                                    />
                                    <v-text-field label="Tanggal Lahir" type='date' v-model="selectedDataTableItem.dob" :rules="[inputFieldRequiredRules]" />
                                    <v-text-field label="Tempat Lahir" v-model="selectedDataTableItem.placeOfBirth" :rules="[inputFieldRequiredRules]" />
                                </v-col>
                                <v-col cols="4" class="px-2">
                                    <v-select label="Agama" v-model="selectedDataTableItem.religion" :items="[ 'ISLAM','HINDU','BUDHA','KRISTEN KATOLIK','KRISTEN PROTESTAN','KONGHUCU']" 
                                        :rules="[inputFieldRequiredRules]"
                                    />
                                    <v-text-field label="No. Hp" v-model="selectedDataTableItem.noHp" :rules="[inputFieldRequiredRules]" />
                                    <v-text-field label="Alamat Email" type="email" v-model="selectedDataTableItem.email" :rules="[inputFieldRequiredRules]" />
                                    <v-text-field label="Divisi" v-model="selectedDataTableItem.division" :rules="[inputFieldRequiredRules]" />
                                    <v-select label="Jabatan" v-model="selectedDataTableItem.employeePositionId" :items="employeePositions" item-text="name"
                                        item-value="id" :rules="[inputFieldRequiredRules]"
                                    />
                                </v-col>
                                <v-col cols="4" class="px-2">
                                    <v-text-field label="Gaji Fungsional" type="number" v-model="selectedDataTableItem.functionalSalary" :rules="[inputFieldRequiredRules]" />
                                    <v-text-field label="Tanggal Pengangkatan" type='date' v-model="selectedDataTableItem.assignmentDate" :rules="[inputFieldRequiredRules]" />
                                    <v-select label="Peran Aplikasi" v-model="selectedDataTableItem.role" :items="roleList" :rules="[inputFieldRequiredRules]"/>
                                    <v-textarea label='Alamat Lengkap' v-model="selectedDataTableItem.address" :rules="[inputFieldRequiredRules]" rows="3" />
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions class="pa-4">
                        <v-btn text color="error" class="text-none" @click="closeFormDialog()"><v-icon size="20">mdi-close</v-icon>&nbsp;Batal</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn dark color="green" class="text-none" type="submit" :loading="isFormDialogLoading" depressed>
                            <v-icon size="20">mdi-content-save</v-icon>&nbsp;Simpan{{ isCreateNewData ? '' : ' Perubahan'}}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>

        <!-- Delete Confirmation Dialog -->
        <ConfirmationDialogComponent :confirmDialogCallback="deleteEmployee.bind()" v-model="isDeleteConfirmationOpen"/>
    </div>
</template>

<script lang="ts">
import { AxiosError } from 'axios';
import { Component, Vue } from 'vue-property-decorator';
import EmployeRole from '~/helper/enum/EmployeRole';
import SystemStateHelper from '~/helper/store/SystemState';
import EmployeeAPI from '~/services/Employee';
import MasterEmployeePositionAPI from '~/services/MasterEmployeePositionAPI';
import ConfirmationDialogComponent from '~/components/global/ConfirmationDialog.vue';

@Component({
    layout: "admin",
    head: {
        title: "Master Data Jabatan"
    },
    components: {
        ConfirmationDialogComponent
    }
})
export default class ManageEmployePage extends Vue {
    isLoading: boolean = true
    employees: Employee.Data[] = []
    isFormDialogOpen: boolean = false
    isFormDialogValid: boolean = false
    isFormDialogLoading: boolean = false
    isDeleteConfirmationOpen: boolean = false
    isCreateNewData: boolean = true
    selectedDataTableItem : Employee.Data = {
        id: '',
        email: '',
        role: EmployeRole.ADMIN,
        employeePosition: '',
        noInduk: '',
        fullname: '',
        gender: 'L',
        placeOfBirth: '',
        dob: '',
        address: '',
        religion: '',
        noHp: '',
        assignmentDate: '',
        division: '',
        functionalSalary: 0,
        employeePositionId: '',
    }
    employeePositions : MasterData.EmployeePosition[] = []
    dataTableHeaders = [
        { text: "No Induk", value: 'noInduk'},
        { text: "Nama Lengkap", value: 'fullname', },
        { text: "Jenis Kelamin", value: 'gender', width: '120px'},
        { text: "No. HP", value: 'noHp'},
        { text: "Divisi", value: 'division'},
        { text: "Jabatan", value: 'employeePosition'},
        {
            text: 'Aksi',
            value: 'actions',
            sortable: false,
            width: '120px'
        },
    ]
    $refs!: {
        employeeForm: HTMLFormElement;
    }

    get roleList () : string[] {
        return [
            EmployeRole.ADMIN,
            EmployeRole.KARYAWAN,
            EmployeRole.MANAJER,
        ]
    }

    inputFieldRequiredRules = (v : any) =>  !!v|| 'Item Ini Wajib diisi'

    async onClickAddBtn () : Promise<void> {
        this.openFormDialog()
    }

    async onClickEditBtn (item : Employee.Data) : Promise<void> {
        this.selectedDataTableItem = item
        this.isCreateNewData = false
        this.openFormDialog()
    }

    async onClickDeleteBtn (item: Employee.Data) : Promise<void> {
        this.selectedDataTableItem = item
        this.isDeleteConfirmationOpen = true
    }

    async onClickShowBtn (item: Employee.Data) : Promise<void> {

    }

    openFormDialog () :void {
        this.isFormDialogOpen = true
    }

    closeFormDialog (refreshData : boolean = false) :void {
        if(refreshData) this.fetchDataEmployees()
        
        this.isFormDialogOpen = false
        this.clearSelectedDataTableItem()
        this.isCreateNewData = true
        this.$refs.employeeForm.resetValidation()
    }

    clearSelectedDataTableItem () {
        this.selectedDataTableItem = {
            id: '',
            email: '',
            role: EmployeRole.ADMIN,
            employeePosition: '',
            noInduk: '',
            fullname: '',
            gender: 'L',
            placeOfBirth: '',
            dob: '',
            address: '',
            religion: '',
            noHp: '',
            assignmentDate: '',
            division: '',
            functionalSalary: 0,
            employeePositionId: '',
        }
    }

    onFormDialogSubmitted () : void {
        if(!this.$refs.employeeForm.validate()) return

        if(this.isCreateNewData) this.storeEmploye()
        else this.updateEmploye()
    }

    async fetchDataEmployees () : Promise<void> {
        this.isLoading = true
        await EmployeeAPI.get().then( (data) => {
            this.employees = data
        })
        .catch( (error : any) => {
            let _errMessage = error.message
            if(error instanceof AxiosError) _errMessage = (error.response?.data  as System.ApiReponse<any>).message
            
            this.$notifier.showMessage({ content: _errMessage, color: "error"})
        })
        .finally ( () => this.isLoading = false)
    }

    async fetchEmployeePosition () : Promise<void> {
        await MasterEmployeePositionAPI.get().then((data) => [
            this.employeePositions = data
        ])
        .catch( (error : any) => {
            let _errMessage = error.message
            if(error instanceof AxiosError) _errMessage = (error.response?.data  as System.ApiReponse<any>).message
            
            this.$notifier.showMessage({ content: _errMessage, color: "error"})
        })
    }

    async storeEmploye () :Promise<void> {
        this.isFormDialogLoading = true
        
        await EmployeeAPI.post(this.selectedDataTableItem)
        .then( resp => {
            this.$notifier.showMessage({ content: resp, color: "success"})
            this.closeFormDialog(true)
        })
        .catch( (error : any) => {
            let _errMessage = error.message
            if(error instanceof AxiosError) _errMessage = (error.response?.data  as System.ApiReponse<any>).message
            
            this.$notifier.showMessage({ content: _errMessage, color: "error"})
        })
        .finally( () => this.isFormDialogLoading = false)
    }

    async updateEmploye () :Promise<void> {
        const { id } = this.selectedDataTableItem
        this.isFormDialogLoading = true

        await EmployeeAPI.put(this.selectedDataTableItem.id, this.selectedDataTableItem)
        .then( resp => {
            this.$notifier.showMessage({ content: resp, color: "success"})
            this.closeFormDialog(true)
        })
        .catch( (error : any) => {
            let _errMessage = error.message
            if(error instanceof AxiosError) _errMessage = (error.response?.data  as System.ApiReponse<any>).message
            
            this.$notifier.showMessage({ content: _errMessage, color: "error"})
        })
        .finally( () => this.isFormDialogLoading = false)
    }

    async deleteEmployee () : Promise<void> {
        const { id } = this.selectedDataTableItem

        await EmployeeAPI.destroy(id)
        .then( resp => {
            this.$notifier.showMessage({ content: resp, color: "success"})
            this.clearSelectedDataTableItem()
            this.fetchDataEmployees()
        })
        .catch( (error : any) => {
            let _errMessage = error.message
            if(error instanceof AxiosError) _errMessage = (error.response?.data  as System.ApiReponse<any>).message
            
            this.$notifier.showMessage({ content: _errMessage, color: "error"})
        })
    }
    
    mounted () {
        this.fetchDataEmployees()
        this.fetchEmployeePosition()
    }

    created () {
        this.$store.commit(SystemStateHelper.mutation.updateTitle, "Kelola Data Karyawan")
    }
}
</script>