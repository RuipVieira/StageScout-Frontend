<template>
    <div class="page-content-container">
        <h1 class="mb-3 text-center">Administração - Gestão de Utilizadores</h1>
        <div class="d-flex flex-row flex-wrap">
            <div class="filter-section me-4">
                <form @submit.prevent>
                    <div class="form-control p-4">
                        <h4 class="mb-3">Filtrar Pesquisa</h4>
                        <div class="mb-3">
                            <label for="userName" class="form-label">Nome</label>
                            <input v-model="filters.name" type="text" id="userName" class="form-control" />
                        </div>
                        <div class="mb-3">
                            <label for="userEmail" class="form-label">Email</label>
                            <input v-model="filters.email" type="text" id="userEmail" class="form-control" />
                        </div>
                        <div class="mb-3">
                            <label for="userNation" class="form-label">Nacionalidade</label>
                            <input v-model="filters.nation" type="text" id="userNation" class="form-control" />
                        </div>
                        <div class="mb-3">
                            <label for="userDistrict" class="form-label">Naturalidade</label>
                            <input v-model="filters.district" type="text" id="userDistrict" class="form-control" />
                        </div>
                        <div class="mb-3">
                            <label for="userAccType" class="form-label">Tipo de Conta</label>
                            <select v-model="filters.accType" id="userAccType" class="form-control">
                                <option v-for="type in userTypes" :key="type.id" :value="type.id">
                                    {{ type.name }}
                                </option>
                            </select>
                        </div>
                        <div class="d-flex align-items-center" style="min-height: 38px;">
                            <label for="userIsBanned" class="form-label me-2 mb-0">Utilizadores Banidos</label>
                            <input v-model="filters.isBanned" type="checkbox" id="userIsBanned" class="form-check-input mt-0" />
                        </div>
                        <button type="button" class="btn btn-danger btn-cancelar mt-2" @click="clearFilters">Limpar</button>
                    </div>
                </form>
            </div>

            <div class="table-section overflow-auto">
                <el-table :data="paginatedData.length ? paginatedData : [{}]"
                          stripe
                          style="width: 100%; min-width: 1200px;"
                          class="mb-4">
                    <el-table-column prop="name"
                                     label="Nome"
                                     sortable>
                        <template #default="scope">
                            <span v-if="scope.row.name">{{ scope.row.name }}</span>
                            <span v-else-if="paginatedData.length">N/A</span>
                            <span v-else class="text-muted">Nenhum dado disponível</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="email"
                                     label="Email"
                                     sortable>
                        <template #default="scope">
                            <span v-if="scope.row.email">{{ scope.row.email }}</span>
                            <span v-else-if="paginatedData.length">N/A</span>
                            <span v-else class="text-muted">Nenhum dado disponível</span>
                        </template>
                    </el-table-column>

                    <el-table-column prop="district.nationality"
                                     label="Nacionalidade"
                                     sortable  width="150">
                    </el-table-column>
                    <el-table-column prop="district.name"
                                     label="Naturalidade"
                                     sortable width="150">
                    </el-table-column>

                    <el-table-column prop="accountType.name"
                                     label="Tipo de Conta"
                                     sortable width="150">
                    </el-table-column>

                    <el-table-column prop="stateId" width="100" label="Estado" sortable>
                        <template #default="scope">
                            <span v-if="scope.row.stateId === 0">Ativo</span>
                            <span v-else-if="scope.row.stateId === 1">Bloqueado</span>
                            <span v-else>N/A</span>
                        </template>
                    </el-table-column>

                    <el-table-column width="150"
                                     align="center">
                        <template #default="scope">
                            <div v-if="paginatedData.length">
                                <el-button type="primary"
                                           class="btn-editar"
                                           size="small"
                                           circle
                                           @click="openEditUserModal(scope.row.email)">
                                    <el-icon><Edit /></el-icon>
                                </el-button>
                                <el-button class="btn-cancelar"
                                           type="danger"
                                           size="small"
                                           circle
                                           @click="toggleBlockUser(scope.row)">
                                    <el-icon>
                                        <component :is="scope.row.stateId === 1 ? 'Unlock' : 'Lock'" />
                                    </el-icon>
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="d-flex justify-content-center">
                    <el-pagination :current-page="pagination.page"
                                   :page-size="pagination.pageSize"
                                   :total="filteredData.length"
                                   layout="prev, pager, next"
                                   @current-change="onPageChange" />
                </div>
            </div>
        </div>
    </div>
    <EditUserModal @closeEditUserModal="toggleModalEditUser" :editUserModalActive="editUserModalActive" :selectedUserEmail="selectedUser" />
</template>


<script>
    import axios from 'axios'
    import 'element-plus/dist/index.css'
    import Swal from 'sweetalert2'
    import { ElTable, ElTableColumn, ElPagination } from 'element-plus'
    import { Edit, Lock, Unlock } from '@element-plus/icons-vue'
    import EditUserModal from '@/components/AdminComponents/SubComponents/modalEditUser.vue'

    export default {
        name: 'AdminUserSearch',
        components: {
            Edit, Lock, Unlock,
            EditUserModal
        },
        data() {
            return {
                editUserModalActive: false,
                users: [],
                userTypes: [],
                selectedUser: null,
                pagination: {
                    page: 1,
                    pageSize: 15
                },
                filters: {
                    name: '',
                    email: '',
                    nation: '',
                    district: '',
                    accType: '',
                    isBanned: false
                }
            }
        },

        computed: {
            filteredData() {
                return this.users.filter(user =>
                    (!this.filters.name || user.name?.toLowerCase().includes(this.filters.name.toLowerCase())) &&
                    (!this.filters.email || user.email?.toLowerCase().includes(this.filters.email.toLowerCase())) &&
                    (!this.filters.nation || user.district?.nationality?.toLowerCase().includes(this.filters.nation.toLowerCase())) &&
                    (!this.filters.district || user.district?.name?.toLowerCase().includes(this.filters.district.toLowerCase())) &&
                    (!this.filters.accType || user.accountType?.id == this.filters.accType) &&
                    (!this.filters.isBanned || user.stateId == 1)
                );
            },

            paginatedData() {
                const start = (this.pagination.page - 1) * this.pagination.pageSize
                return this.filteredData.slice(start, start + this.pagination.pageSize)
            }
        },

        methods: {
            async fetchUsers() {
                try {
                    const response = await axios.get('https://localhost:7216/api/Helper/GetAllUsers')
                    console.log(response.data)
                    this.users = response.data || []
                } catch (error) {
                    const message = error.response?.data?.message || 'Erro de pesquisa. Tente novamente.'
                    Swal.fire('Erro', message, 'error')
                }
            },
            async fetchUserTypes() {
                try {
                    const response = await axios.get('https://localhost:7216/api/Helper/GetAllUserTypes')
                    this.userTypes = response.data || []
                } catch (error) {
                    const message = error.response?.data?.message || 'Erro de pesquisa. Tente novamente.'
                    Swal.fire('Erro', message, 'error')
                }
            },

            onPageChange(page) {
                this.pagination.page = page
            },

            clearFilters() {
                this.filters = {
                    name: '',
                    email: '',
                    nation: '',
                    district: '',
                    accType: '',
                    isBanned: false
                };
            },
            toggleModalEditUser() {
                this.editUserModalActive = !this.editUserModalActive;
                if (!this.editUserModalActive) {
                    this.selectedUser  = null;
                    this.fetchUsers();
                }
                return this.editUserModalActive;
            },
            openEditUserModal(email) {
                this.selectedUser = email;
                this.editUserModalActive = true;
            },
            toggleBlockUser(user) {
                const isCurrentlyBlocked = user.stateId === 1;

                const actionText = isCurrentlyBlocked ? 'desbloquear' : 'bloquear';
                const pastTense = isCurrentlyBlocked ? 'desbloqueado' : 'bloqueado';

                Swal.fire({
                    title: 'Aviso!',
                    text: `Tem a certeza que pretende ${actionText} este Utilizador?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sim',
                    cancelButtonText: 'Cancelar'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            await axios.post("https://localhost:7216/api/Admin/ToggleBlockUser", user.email.toString(), {
                                headers: { 'Content-Type': 'application/json' }
                            });
                            await this.fetchUsers();
                            Swal.fire('Sucesso!', `Utilizador ${pastTense} com sucesso.`, 'success');
                        } catch (error) {
                            const message = error.response?.data?.message || `Erro ao ${actionText}. Tente novamente.`;
                            Swal.fire('Erro', message, 'error');
                        }
                    }
                });
            }
        },

        mounted() {
            this.fetchUsers();
            
            this.fetchUserTypes();
        }
    }
</script>

<style scoped>
    .filter-section {
        width: 300px;
        min-width: 250px;
    }

    .table-section {
        overflow-x: auto;
        min-width: 0;
    }
</style>