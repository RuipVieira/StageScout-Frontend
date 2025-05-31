<template>
    <transition name="modal-animation">
        <div v-show="modalEditVenueActive" class="modal">
            <transition name="modal-animation-inner">
                <div v-show="modalEditVenueActive" class="modal-inner">
                    <i @click="closeEditVenueModal" class="far fa-times-circle" style="cursor:pointer; font-size: 1.5rem;"></i>
                    <div class="modal-content">
                        <h2 class="mb-3 text-center">Editar Localização</h2>
                        <form @submit.prevent="Edit">
                            <div class="form-control form-container text-center">
                                <label for="selectedVenueName" class="form-label">Nome</label>
                                <input type="text"
                                       v-model="selectedVenueName"
                                       id="selectedVenueName"
                                       class="form-control"
                                       required />

                                <label for="selectedVenueCountry" class="form-label">País</label>
                                <select id="selectedVenueCountry" v-model="selectedVenueCountry" class="form-control">
                                    <option v-for="nation in nationsList" :key="nation.id" :value="nation.id">
                                        {{ nation.name }}
                                    </option>
                                </select>
                                <label for="selectedVenueDistrict" class="form-label">Distrito</label>
                                <select id="selectedVenueDistrict" v-model="selectedVenueDistrict" class="form-control" :disabled="!selectedVenueCountry">
                                    >
                                    <option v-for="district in selectedNationDistricts" :key="district.id" :value="district.id">
                                        {{ district.name }}
                                    </option>
                                </select>
                            </div>
                            <div class="btn-container text-center mt-4">
                                <button type="button"
                                        class="btn btn-danger btn-cancelar"
                                        @click="closeEditVenueModal()">
                                    Cancelar
                                </button>
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
    import axios from "axios";
    import Swal from "sweetalert2";

    export default {
        name: "EditVenueModal",
        props: {
            modalEditVenueActive: Boolean,
            venue: Object,
        },
        data() {
            return {
                selectedVenueName: "",
                selectedNationDistricts: [],
                nationsList: [],
                selectedVenueCountry: '',
                selectedVenueDistrict: ''
            };
        },
        watch: {
            modalEditVenueActive(val) {
                if (val) {
                    this.GetNations();
                }
            },
            selectedVenueCountry(newVal) {
                const selectedNation = this.nationsList.find(nation => nation.id === newVal);
                this.selectedNationDistricts = selectedNation ? selectedNation.districts : [];
            },
            venue: {
                immediate: true,
                handler(venue) {
                    if (venue) {
                        this.selectedVenueName = venue.name || "";
                        this.selectedVenueCountry = venue.country?.id || '';
                        this.selectedVenueDistrict = venue.district?.id || '';
                    } else {
                        this.selectedVenueName = "";
                    }
                },
            },
        },
        methods: {
            async GetNations() {
                try {
                    const response = await axios.get('https://localhost:7216/api/Helper/GetAllNations');
                    this.nationsList = response.data;

                    const current = this.selectedVenueCountry;
                    this.selectedVenueCountry = '';
                    this.$nextTick(() => {
                        this.selectedVenueCountry = current;
                    });
                } catch (error) {
                    const message =
                        error.response?.data?.message || 'Erro de pesquisa. Tente novamente.';
                    Swal.fire('Erro', message, 'error');
                }
            },
            async Edit() {
                try {
                    await axios.post("https://localhost:7216/api/Admin/EditVenue", {
                        VenueId: this.venue?.id,
                        Name: this.selectedVenueName,
                        DistrictId: this.selectedVenueDistrict
                    });

                    Swal.fire("Sucesso", "Localização atualizada com sucesso!", "success");
                    this.closeEditVenueModal();
                } catch (error) {
                    const message =
                        error.response?.data?.message || "Erro ao atualizar. Tente novamente.";
                    Swal.fire("Erro", message, "error");
                }
            },
            closeEditVenueModal() {
                this.selectedVenueName = "";
                this.selectedVenueCountry = '';
                this.selectedVenueDistrict = '';
                this.$emit("closeEditVenueModal");
            },
        },
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
