<template>
    <transition name="modal-animation">
        <div v-show="modalCreateVenueActive" class="modal">
            <transition name="modal-animation-inner">
                <div v-show="modalCreateVenueActive" class="modal-inner">
                    <i @click="closeCreateVenueModal" class="far fa-times-circle"></i>
                    <div class="modal-content">
                        <h2 class="mb-3 text-center">Nova Localização</h2>
                        <form @submit.prevent="create">
                            <div class="form-control form-container text-center">
                                <label for="venueName" class="form-label">Nome</label>
                                <input type="text" v-model="venueName" id="venueName" class="form-control" required>

                                <label for="VenueNationality" class="form-label">País</label>
                                <select id="VenueNationality" v-model="VenueNationality" class="form-control">
                                    <option v-for="nation in nationsList" :key="nation.id" :value="nation.id">
                                        {{ nation.name }}
                                    </option>
                                </select>
                                <label for="venueDistrict" class="form-label">Distrito</label>
                                <select id="venueDistrict" v-model="venueDistrict" class="form-control" :disabled="!VenueNationality">
                                    >
                                    <option v-for="district in selectedNationDistricts" :key="district.id" :value="district.id">
                                        {{ district.name }}
                                    </option>
                                </select>
                            </div>

                            <div class="btn-container text-center">
                                <button type="button" class="btn btn-danger btn-cancelar" @click="closeCreateVenueModal()">Cancelar</button>
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
    import axios from 'axios';
    import Swal from 'sweetalert2';

    export default {
        name: 'CreateVenueModal',
        props: ['modalCreateVenueActive'],
        data() {
            return {
                selectedNationDistricts: [],
                nationsList: [],
                venueName: '',
                VenueNationality: '',
                venueDistrict: ''
            };
        },
        watch: {
            modalCreateVenueActive(val) {
                if (val) {
                    this.GetNations();
                }
            },
            VenueNationality(newVal) {
                const selectedNation = this.nationsList.find(nation => nation.id === newVal);
                this.selectedNationDistricts = selectedNation ? selectedNation.naturalidades : [];
            }
        },
        methods: {
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
            async create() {
                try {
                    await axios.post('https://localhost:7216/api/Admin/CreateVenue', {
                        Name: this.venueName,
                        DistrictId: this.venueDistrict
                    });

                    Swal.fire('Sucesso', 'Localização criada com sucesso!', 'success');
                    this.closeCreateVenueModal();
                } catch (error) {
                    const message =
                        error.response?.data?.message || 'Erro ao criar. Tente novamente.';
                    Swal.fire('Erro', message, 'error');
                }
            },
            closeCreateVenueModal() {
                this.VenueName = '';
                this.VenueNationality = '';
                this.venueDistrict = '';
                this.$emit('closeCreateVenueModal');
            },
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
