<template>
    <div class="d-contents">
        <v-data-table :headers="dataTableHeaders" :items="employees" height="100%" :loading="isLoading" :items-per-page="25" 
                :footer-props="{ 'items-per-page-options': [25, 50, -1] }"
            >
            <template v-slot:top>
                <v-toolbar flat>
                    <v-btn color="blue" dark depressed small class="text-none" @click="onClickAddBtn()"><v-icon>mdi-plus</v-icon> Tambah Data</v-btn>
                </v-toolbar>
            </template>
            <!-- eslint-disable -->
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
                                    <v-text-field label="Gaji Pokok" type="number" v-model="selectedDataTableItem.basicSalary" :rules="[inputFieldRequiredRules]" />
                                    <v-text-field label="No. Rekening" v-model="selectedDataTableItem.bankAccNo" :rules="[inputFieldRequiredRules]" />
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
        <ConfirmationDialogComponent :confirmDialogCallback="deleteEmployee" v-model="isDeleteConfirmationOpen"/>
        <ConfirmationDialogComponent :confirmDialogCallback="deleteEmployeAllowance" v-model="allowanceDialog.isDeleteDialogOpen"/>
        <ConfirmationDialogComponent :confirmDialogCallback="deleteEmployeSalaryCut" v-model="salaryCutDialog.isDeleteDialogOpen"/>

        <!-- Show Employe Detail Dialog -->
        <v-dialog v-model="isShowEmployeDialogOpen" fullscreen hide-overlay transition="dialog-bottom-transition" persistent>
            <v-card>
                <v-toolbar color="primary" dark dense elevation="0">
                    <v-toolbar-title>Detail Data Karyawan</v-toolbar-title>
                    <v-spacer />
                    <v-btn icon dark @click="closeShowEmployeDialog">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                    <v-container>
                        <v-sheet outlined rounded="lg" class="pa-8 d-flex">
                            <div>
                                <v-avatar size="180">
                                    <img alt="Employe Picture" src="/img/user-placeholder/two-color.svg">
                                </v-avatar>
                                <v-btn depressed block outlined color="green" class="mt-4 text-none" @click="onClickUbahBtn()"><v-icon>mdi-pencil</v-icon>Ubah</v-btn>
                            </div>
                            <v-container class="mx-6">
                                <v-row>
                                    <v-col md="4">
                                        <div class="text-caption">No. Induk</div>
                                        <div class="text-body-1 font-weight-medium grey--text text--darken-2">{{ detailEmploye.noInduk }}</div>
                                        <div class="text-caption mt-3">Nama Lengkap</div>
                                        <div class="text-body-1 font-weight-medium grey--text text--darken-2">{{ detailEmploye.fullname }}</div>
                                        <div class="text-caption mt-3">Jenis Kelamin</div>
                                        <div class="text-body-1 font-weight-medium grey--text text--darken-2">{{ detailEmploye.gender }}</div>
                                        <div class="text-caption mt-3">Tempat, Tanggal Lahir</div>
                                        <div class="text-body-1 font-weight-medium grey--text text--darken-2">{{ `${detailEmploye.placeOfBirth}, ${detailEmploye.dob}` }}</div>
                                        <div class="text-caption mt-3">Agama</div>
                                        <div class="text-body-1 font-weight-medium grey--text text--darken-2">{{ `${detailEmploye.religion}` }}</div>
                                    </v-col>
                                    <v-col md="4">
                                        <div class="text-caption">No. Hp</div>
                                        <div class="text-body-1 font-weight-medium grey--text text--darken-2">{{ detailEmploye.noHp }}</div>
                                        <div class="text-caption  mt-3">Alamat Email</div>
                                        <div class="text-body-1 font-weight-medium grey--text text--darken-2">{{ detailEmploye.email }}</div>
                                        <div class="text-caption  mt-3">Role Aplikasi</div>
                                        <div class="text-body-1 font-weight-medium grey--text text--darken-2">{{ detailEmploye.role }}</div>
                                        <div class="text-caption  mt-3">Alamat Lengkap</div>
                                        <div class="text-body-1 font-weight-medium grey--text text--darken-2">{{ detailEmploye.address }}</div>
                                    </v-col>
                                    <v-col md="4">
                                        <div class="text-caption">Divisi</div>
                                        <div class="text-body-1 font-weight-medium grey--text text--darken-2">{{ detailEmploye.division }}</div>
                                        <div class="text-caption mt-3">Jabatan</div>
                                        <div class="text-body-1 font-weight-medium grey--text text--darken-2">{{ detailEmploye.employeePosition }}</div>
                                        <div class="text-caption mt-3">Tgl. Pengangkatan</div>
                                        <div class="text-body-1 font-weight-medium grey--text text--darken-2">{{ detailEmploye.assignmentDate }}</div>
                                        <div class="text-caption mt-3">Gaji Pokok</div>
                                        <div class="text-body-1 font-weight-medium grey--text text--darken-2">{{ formatRupiah(detailEmploye.basicSalary) }}</div>
                                        <div class="text-caption mt-3">No. Rekening</div>
                                        <div class="text-body-1 font-weight-medium grey--text text--darken-2">{{ detailEmploye.bankAccNo }}</div>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-sheet>
                        <v-row class="mt-1">
                            <v-col md="6">
                                <v-sheet outlined rounded="lg" class="SheetEmployeeItem px-4 py-2">
                                    <div class="text-subtitle-1 primary--text">
                                        Tunjangan Karyawan
                                        <v-btn icon outlined color="info" small @click="onClickAddAllowance">
                                            <v-icon>mdi-plus</v-icon>
                                        </v-btn>
                                    </div>
                                    <v-simple-table fixed-header height="250px">
                                        <thead>
                                            <tr>
                                                <th>Nama Tunjangan</th>
                                                <th>Jumlah</th>
                                                <th :style="'width:75px'"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="item in allowances" :key="item.id">
                                                <td>{{ item.name }}</td>
                                                <td>{{ item.amount }}</td>
                                                <td>
                                                    <v-icon small @click="onClickDeleteAllowances(item)" color="error" title="Hapus">mdi-delete</v-icon>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </v-simple-table>
                                </v-sheet>
                            </v-col>
                            <v-col md="6">
                                <v-sheet outlined rounded="lg" class="SheetEmployeeItem px-4 py-2">
                                    <div class="text-subtitle-1 primary--text">
                                        Potongan Gaji
                                        <v-btn icon outlined color="info" small @click="onClickAddSalaryCut">
                                            <v-icon>mdi-plus</v-icon>
                                        </v-btn>
                                    </div>
                                    <v-simple-table fixed-header height="250px">
                                        <thead>
                                            <tr>
                                                <th>Nama Potongan</th>
                                                <th>Jumlah</th>
                                                <th>Type</th>
                                                <th :style="'width:75px'"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="item in salaryCuts" :key="item.id">
                                                <td>{{ item.name }}</td>
                                                <td>{{ item.amount }}</td>
                                                <td>{{ item.type }}</td>
                                                <td>
                                                    <v-icon small @click="onClickDeleteSalaryCut(item)" color="error" title="Hapus">mdi-delete</v-icon>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </v-simple-table>
                                </v-sheet>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>

        <!-- dialog add allowances -->
        <v-dialog v-model="allowanceDialog.isOpen" width="350px" persistent>
            <v-form ref="formAddAllowances" v-model="allowanceDialog.isValid" lazy-validation @submit.prevent="onSubmitFormAddAllowance">
                <v-card :loading="allowanceDialog.isLoading" :disabled="allowanceDialog.isLoading">
                    <v-toolbar color="primary" dark dense elevation="0">Tambah Tunjangan</v-toolbar>
                    <v-card-text>
                        <v-container fluid class="pa-0">
                            <v-row dense>
                                <v-col cols="12">
                                    <v-select label="Jabatan" v-model="allowanceDialog.allowanceId" :items="allowanceDialog.masterAllowance" 
                                        :rules="[inputFieldRequiredRules]"
                                    />
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions class="py-4">
                        <v-btn text color="error" class="text-none" @click="closeAllowanceDialog()"><v-icon size="20">mdi-close</v-icon>&nbsp;Batal</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn dark color="green" class="text-none" type="submit" :loading="allowanceDialog.isLoading" depressed>
                            <v-icon size="20">mdi-content-save</v-icon>&nbsp;Submit
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>

        <!-- dialog add salary cut -->
        <v-dialog v-model="salaryCutDialog.isOpen" width="350px" persistent>
            <v-form ref="formAddSalaryCut" v-model="salaryCutDialog.isValid" lazy-validation @submit.prevent="onSubmitFormAddSalaryCut">
                <v-card :loading="salaryCutDialog.isLoading" :disabled="salaryCutDialog.isLoading">
                    <v-toolbar color="primary" dark dense elevation="0">Tambah Tunjangan</v-toolbar>
                    <v-card-text>
                        <v-container fluid class="pa-0">
                            <v-row dense>
                                <v-col cols="12">
                                    <v-select label="Potongan Gaji" v-model="salaryCutDialog.salaryCutId" :items="salaryCutDialog.masterSalaryCut" 
                                        :rules="[inputFieldRequiredRules]"
                                    />
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions class="py-4">
                        <v-btn text color="error" class="text-none" @click="closeSalaryCutDialog()"><v-icon size="20">mdi-close</v-icon>&nbsp;Batal</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn dark color="green" class="text-none" type="submit" :loading="salaryCutDialog.isLoading" depressed>
                            <v-icon size="20">mdi-content-save</v-icon>&nbsp;Submit
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
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
import EmployeeAllowanceAPI from '../../services/EmployeeAllowance';
import MasterAllowanceAPI from '~/services/MasterAllowanceAPI';
import EmployeeSalaryCutAPI from '../../services/EmployeeSalaryCutAPI';
import MasterSalaryCutAPI from '~/services/MasterSalaryCutAPI';

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
    isShowEmployeDialogOpen: boolean = false
    isFetchEmployeByUUID: boolean = false
    allowanceDialog : {
        isOpen : boolean
        isValid: boolean
        isLoading: boolean
        masterAllowance: {text: string, value : string}[]
        allowanceId: string
        isDeleteDialogOpen: boolean
    }= {
        isOpen : false,
        isValid: true,
        isLoading: true,
        masterAllowance : [],
        allowanceId: '',
        isDeleteDialogOpen: false
    } 
    salaryCutDialog : {
        isOpen : boolean
        isValid: boolean
        isLoading: boolean
        masterSalaryCut: {text: string, value : string}[]
        salaryCutId: string
        isDeleteDialogOpen: boolean
    }= {
        isOpen : false,
        isValid: true,
        isLoading: true,
        masterSalaryCut : [],
        salaryCutId: '',
        isDeleteDialogOpen: false
    } 

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
        basicSalary: 0,
        employeePositionId: '',
        bankAccNo: '',
    }
    detailEmploye : Employee.Data = {
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
        basicSalary: 0,
        employeePositionId: '',
        bankAccNo: '',
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
    allowances : MasterData.Allowance[] = []
    salaryCuts : MasterData.SalaryCut[] = []

    $refs!: {
        employeeForm: HTMLFormElement;
        formAddAllowances: HTMLFormElement;
        formAddSalaryCut: HTMLFormElement;
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

    onClickShowBtn (item: Employee.Data) : void {
        this.detailEmploye = item
        this.isShowEmployeDialogOpen = true
        this.fetchAllowanceEmploye(item.id)
        this.fetchSalaryCutEmploye(item.id)
    }

    onClickUbahBtn () {
        this.onClickEditBtn({ ...this.detailEmploye} )
        this.isFetchEmployeByUUID = true
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
            basicSalary: 0,
            employeePositionId: '',
            bankAccNo: '',
        }
    }

    onFormDialogSubmitted () : void {
        if(!this.$refs.employeeForm.validate()) return

        if(this.isCreateNewData) this.storeEmploye()
        else this.updateEmploye()
    }

    closeShowEmployeDialog () : void {
        this.isShowEmployeDialogOpen = false
        this.allowances = []
    }

    formatRupiah (amount : number) {
        const formattedSalary = amount ? new Intl.NumberFormat('id-ID').format(amount) : 0

        return `Rp. ${formattedSalary}`
    }

    onClickDeleteAllowances (item : MasterData.Allowance) {
        this.allowanceDialog.allowanceId = item.id
        this.allowanceDialog.isDeleteDialogOpen = true
    }

    onClickAddAllowance () : void {
        this.allowanceDialog.isLoading = true
        MasterAllowanceAPI.get().then( (data) => {
            data.forEach(element => {
                this.allowanceDialog.masterAllowance.push({
                    text: `${element.name} (${this.formatRupiah(element.amount)})`,
                    value: element.id
                })
            });
        })
        .catch( (error : any) => {
            let _errMessage = error.message
            if(error instanceof AxiosError) _errMessage = (error.response?.data  as System.ApiReponse<any>).message
            
            this.$notifier.showMessage({ content: _errMessage, color: "error"})
        })
        .finally ( () => this.allowanceDialog.isLoading = false)

        this.allowanceDialog.isOpen = true
    }

    onSubmitFormAddAllowance () : void {
        if(!this.$refs.formAddAllowances.validate()) return

        this.allowanceDialog.isLoading = true
        EmployeeAllowanceAPI.add(this.detailEmploye.id, this.allowanceDialog.allowanceId)
        .then( (resp) => {
            this.$notifier.showMessage({ content: resp, color: "success"})
            this.closeAllowanceDialog(true)
        })
        .catch( (error : any) => {
            let _errMessage = error.message
            if(error instanceof AxiosError) _errMessage = (error.response?.data  as System.ApiReponse<any>).message
            
            this.$notifier.showMessage({ content: _errMessage, color: "error"})
        })
        .finally ( () => this.allowanceDialog.isLoading = false)
    }

    onClickAddSalaryCut () : void {
        this.salaryCutDialog.isLoading = true
        MasterSalaryCutAPI.get().then( (data) => {
            data.forEach(element => {
                this.salaryCutDialog.masterSalaryCut.push({
                    text: `${element.name} (${element.type === 'amount' ? this.formatRupiah(element.amount) : element.amount + '%'}) - ${element.type}`,
                    value: element.id
                })
            });
        })
        .catch( (error : any) => {
            let _errMessage = error.message
            if(error instanceof AxiosError) _errMessage = (error.response?.data  as System.ApiReponse<any>).message
            
            this.$notifier.showMessage({ content: _errMessage, color: "error"})
        })
        .finally ( () => this.salaryCutDialog.isLoading = false)

        this.salaryCutDialog.isOpen = true
    }

    onClickDeleteSalaryCut (item : MasterData.SalaryCut) : void{
        this.salaryCutDialog.salaryCutId = item.id
        this.salaryCutDialog.isDeleteDialogOpen = true
    }

    onSubmitFormAddSalaryCut () : void {
        if(!this.$refs.formAddSalaryCut.validate()) return

        this.salaryCutDialog.isLoading = true
        EmployeeSalaryCutAPI.add(this.detailEmploye.id, this.salaryCutDialog.salaryCutId)
        .then( (resp) => {
            this.$notifier.showMessage({ content: resp, color: "success"})
            this.closeSalaryCutDialog(true)
        })
        .catch( (error : any) => {
            let _errMessage = error.message
            if(error instanceof AxiosError) _errMessage = (error.response?.data  as System.ApiReponse<any>).message
            
            this.$notifier.showMessage({ content: _errMessage, color: "error"})
        })
        .finally ( () => this.salaryCutDialog.isLoading = false)
    }

    async closeSalaryCutDialog (refreshData : boolean = false) : Promise<void> {
        if(refreshData) {
            this.fetchSalaryCutEmploye(this.detailEmploye.id)
        }

        this.$refs.formAddSalaryCut.resetValidation()
        this.salaryCutDialog.salaryCutId = ''
        this.salaryCutDialog.isOpen = false
    }

    async closeAllowanceDialog (refreshData : boolean = false) : Promise<void> {
        if(refreshData) {
            this.fetchAllowanceEmploye(this.detailEmploye.id)
        }

        this.$refs.formAddAllowances.resetValidation()
        this.allowanceDialog.allowanceId = ''
        this.allowanceDialog.isOpen = false
    }

    async deleteEmployeAllowance () : Promise<void>  {
        const { allowanceId } = this.allowanceDialog

        await EmployeeAllowanceAPI.destroy(allowanceId)
        .then( resp => {
            this.$notifier.showMessage({ content: resp, color: "success"})
            this.fetchAllowanceEmploye(this.detailEmploye.id)
            this.allowanceDialog.allowanceId = ''
        })
        .catch( (error : any) => {
            let _errMessage = error.message
            if(error instanceof AxiosError) _errMessage = (error.response?.data  as System.ApiReponse<any>).message
            
            this.$notifier.showMessage({ content: _errMessage, color: "error"})
        })
    }

    async deleteEmployeSalaryCut () : Promise<void>  {
        const { salaryCutId } = this.salaryCutDialog

        await EmployeeSalaryCutAPI.destroy(salaryCutId)
        .then( resp => {
            this.$notifier.showMessage({ content: resp, color: "success"})
            this.fetchSalaryCutEmploye(this.detailEmploye.id)
            this.salaryCutDialog.salaryCutId = ''
        })
        .catch( (error : any) => {
            let _errMessage = error.message
            if(error instanceof AxiosError) _errMessage = (error.response?.data  as System.ApiReponse<any>).message
            
            this.$notifier.showMessage({ content: _errMessage, color: "error"})
        })
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

    async fetchEmployeByUUID (uuid: string) :Promise<void> {
        await EmployeeAPI.getbyUUID(uuid)
        .then((data) => {
            this.detailEmploye = data
        })
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

        await EmployeeAPI.put(id, this.selectedDataTableItem)
        .then( async (resp) => {
            this.$notifier.showMessage({ content: resp, color: "success"})
            if(this.isFetchEmployeByUUID) await this.fetchEmployeByUUID(id)
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

    async fetchAllowanceEmploye(employeUuid : string) : Promise<void> {
        await EmployeeAllowanceAPI.get(employeUuid).then( (data) => {
            this.allowances = data
        })
        .catch( (error : any) => {
            let _errMessage = error.message
            if(error instanceof AxiosError) _errMessage = (error.response?.data  as System.ApiReponse<any>).message
            
            this.$notifier.showMessage({ content: _errMessage, color: "error"})
        })
    }

    async fetchSalaryCutEmploye(employeUuid : string) : Promise<void> {
        await EmployeeSalaryCutAPI.get(employeUuid).then( (data) => {
            this.salaryCuts = data
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

<style lang="scss" scoped>
.SheetEmployeeItem{
    height: 300px
}
</style>