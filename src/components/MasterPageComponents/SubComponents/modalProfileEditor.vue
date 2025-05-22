<template>
    <transition name="modal-animation">
        <div v-show="profileModalActive" class="modal">
            <transition name="modal-animation-inner">
                <div v-show="profileModalActive" class="modal-inner">
                    <i @click="closeProfileModal" class="far fa-times-circle"></i>
                    <div class="modal-content">
                        <h2 class="mb-3 text-center">Editar Perfil</h2>
                        <form @submit.prevent="profile">
                            <div class="form-control form-container text-center">
                                <label for="profileName" class="form-label">Nome</label>
                                <input type="text" v-model="profileName" id="profileName" class="form-control" required>

                                <label for="profileBirthDate" class="form-label">Data de Nascimento</label>
                                <input type="date" v-model="profileBirthDate" id="profileBirthDate" class="form-control" required>

                                <label for="profileGender" class="form-label">Género</label>
                                <select id="profileGender" v-model="profileGender" class="form-control">
                                    <option v-for="gender in gendersList" :key="gender.id" :value="gender.id">
                                        {{ gender.name }}
                                    </option>
                                </select>

                                <label for="profileNacionalidade" class="form-label">Nacionalidade</label>
                                <select id="profileNacionalidade" v-model="profileNacionalidade" class="form-control">
                                    <option v-for="nation in nationsList" :key="nation.id" :value="nation.id">
                                        {{ nation.descricao }}
                                    </option>
                                </select>
                                <label for="profileNaturalidade" class="form-label">Naturalidade</label>
                                <select id="profileNaturalidade" v-model="profileNaturalidade" class="form-control" :disabled="!profileNacionalidade">
                                    >
                                    <option v-for="district in selectedNationDistricts" :key="district.id" :value="district.id">
                                        {{ district.descricao }}
                                    </option>
                                </select>
                            </div>

                            <div class="btn-container text-center">
                                <button type="button" class="btn btn-danger btn-cancelar" @click="closeProfileModal">Cancelar</button>
                                <button type="submit" class="btn btn-primary">Confirmar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>


<script>
    import Swal from 'sweetalert2';
    import axios from 'axios';
    import { authState } from '../../../auth';

    export default {
        name: 'ProfileModal',
        props: ['profileModalActive'],
        data() {
            return {
                profileName: '',
                profileBirthDate: '',
                profileGender: '',
                profileNacionalidade: '',
                profileNaturalidade: '',
                selectedNationDistricts: [],
                nationsList: [],
                gendersList: [
                    { id: '1', name: 'Indefinido' },
                    { id: '2', name: 'Masculino' },
                    { id: '3', name: 'Feminino' },
                    { id: '4', name: 'Não Binário' }
                ],
                authState: authState
            };
        },
        watch: {
            profileModalActive(newVal) {
                if (newVal) {
                    this.GetProfileDetails();
                    this.GetNations();
                }
            },
            profileNacionalidade(newVal) {
                const selectedNation = this.nationsList.find(nation => nation.id === newVal);
                this.selectedNationDistricts = selectedNation ? selectedNation.naturalidades : [];
            }
        },
        methods: {
            closeProfileModal() {
                this.profileName = '';
                this.profileBirthDate = '';
                this.profileGender = '';
                this.profileNacionalidade = '';
                this.profileNaturalidade = '';
                this.$emit('closeProfileModal');
            },

            async profile() {
                try {
                    await axios.post('https://localhost:7216/api/account/EditProfile', {
                        PerfilId: localStorage.getItem('profileId'),
                        Nome: this.profileName,
                        DataNascimento: this.profileBirthDate,
                        NaturalidadeId: this.profileNaturalidade,
                        GeneroId: this.profileGender
                    });

                    Swal.fire('Sucesso', 'Perfil Editado com sucesso!', 'success');
                    this.closeProfileModal();
                } catch (error) {
                    const message =
                        error.response?.data?.message || 'Erro ao registar. Tente novamente.';
                    Swal.fire('Erro', message, 'error');
                }
            },

            async GetNations() {
                try {
                    const response = await axios.get('https://localhost:7216/api/Helper/GetAllNations');
                    this.nationsList = response.data;
                } catch (error) {
                    const message =
                        error.response?.data?.message || 'Erro de pesquisa. Tente novamente.';
                    Swal.fire('Erro', message, 'error');
                }
            },

            async GetProfileDetails() {
                if (this.authState.isLoggedIn) {
                    try {
                        const response = await axios.get('https://localhost:7216/api/Account/GetProfileDetails', {
                            params: {
                                profileId: localStorage.getItem('profileId')
                            }
                        });

                        this.profileName = response.data.name;
                        this.profileBirthDate = response.data.birthDate;
                        this.profileGender = response.data.generoId;
                        this.profileNacionalidade = response.data.nacionalidadeId;
                        this.profileNaturalidade = response.data.naturalidadeId;

                    } catch (error) {
                        const message =
                            error.response?.data?.message || 'Erro de pesquisa. Tente novamente.';
                        Swal.fire('Erro', message, 'error');
                    }
                }
            }
        }
    };
</script>


<style scoped>
    .modal-animation-enter-active,
    .modal-animation-leave-active {
        transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
    }

    .modal-animation-enter-from,
    .modal-animation-leave-to {
        opacity: 0;
    }

    .modal-animation-inner-enter-active {
        transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
    }

    .modal-animation-inner-leave-active {
        transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
    }

    .modal-animation-inner-enter-from {
        opacity: 0;
        transform: scale(0.8);
    }

    .modal-animation-inner-leave-to {
        transform: scale(0.8);
    }

    .modal {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100vw;
        position: fixed;
        top: 0;
        left: 0;
        background-color: rgba(255, 255, 255, 0.7);
        .modal-inner

    {
        position: relative;
        max-width: 300px;
        width: 80%;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        background-color: #fff;
        padding: 50px 10px 10px 10px;
        i

    {
        position: absolute;
        top: 15px;
        right: 15px;
        font-size: 20px;
        cursor: pointer;
        &:hover

    {
        color: crimson;
    }

    }
    }
    }
</style>