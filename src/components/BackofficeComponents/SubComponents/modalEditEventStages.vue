<template>
    <transition name="modal-animation">
        <div v-show="modalEditEventStagesActive" class="modal">
            <transition name="modal-animation-inner">
                <div v-show="modalEditEventStagesActive" class="modal-inner">
                    <i @click="closeEditEventStagesModal" class="far fa-times-circle" style="cursor:pointer; font-size: 1.5rem;"></i>
                    <div class="modal-content">
                        <h2 class="mb-3 text-center">Lista de Palcos</h2>
                        <form @submit.prevent="Edit">
                            <div class="form-control form-container text-center">
                                <div class="mt-4 mb-2 text-center">
                                    <label class="form-label">Adicionar Palco</label>
                                    <select v-model.number="stageToAdd" class="form-select" @change="addStage">
                                        <option disabled value="">Selecione um Palco:</option>
                                        <option v-for="p in availableStages" :key="p.id" :value="p.id">
                                            {{ p.nome }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="text-center">
                                <table class="table table-striped table-hover" style="cursor: pointer;">
                                    <thead>
                                        <tr>
                                            <th>Palcos Selecionados</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="stage in pagedSelectedStages"
                                            :key="stage.id"
                                            @click="removeStage(stage.id)"
                                            title="Clique para remover">
                                            <td>{{ stage.nome }}</td>
                                        </tr>
                                        <tr v-if="pagedSelectedStages.length === 0">
                                            <td class="text-center">Nenhum palco selecionado</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <nav v-if="pageCount > 1" aria-label="Stage pagination">
                                    <ul class="pagination justify-content-center">
                                        <li class="page-item"
                                            :class="{ disabled: paginationPage === 1 }"
                                            @click="changePage(paginationPage - 1)">
                                            <a class="page-link" href="#" tabindex="-1">Anterior</a>
                                        </li>
                                        <li v-for="page in pageCount"
                                            :key="page"
                                            class="page-item"
                                            :class="{ active: page === paginationPage }"
                                            @click="changePage(page)">
                                            <a class="page-link" href="#">{{ page }}</a>
                                        </li>
                                        <li class="page-item"
                                            :class="{ disabled: paginationPage === pageCount }"
                                            @click="changePage(paginationPage + 1)">
                                            <a class="page-link" href="#">Próximo</a>
                                        </li>
                                    </ul>
                                </nav>
                            </div>

                            <div class="btn-container text-center mt-4">
                                <button type="button"
                                        class="btn btn-danger btn-cancelar"
                                        @click="closeEditEventStagesModal()">
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
        name: "EditEventStagesModal",
        props: {
            modalEditEventStagesActive: Boolean,
            eventDetails: Object,
        },
        data() {
            return {
                allStages: [],
                selectedStages: [],
                stageToAdd: "",
                paginationPage: 1,
                stagesPerPage: 5,
            };
        },
        computed: {
            availableStages() {
                const selectedIds = this.selectedStages.map((p) => p.id);
                return this.allStages.filter((p) => !selectedIds.includes(p.id));
            },
            pageCount() {
                return Math.ceil(this.selectedStages.length / this.stagesPerPage);
            },
            pagedSelectedStages() {
                const start = (this.paginationPage - 1) * this.stagesPerPage;
                return this.selectedStages.slice(start, start + this.stagesPerPage);
            },
        },
        watch: {
            eventDetails: {
                immediate: true,
                handler(event) {
                    if (event && event.palcos) {
                        this.selectedStages = event.palcos.map((p) => ({
                            id: p.id,
                            nome: p.name,
                        }));
                    } else {
                        this.selectedStages = [];
                    }
                    this.paginationPage = 1;
                    this.stageToAdd = "";
                },
            },
            modalEditEventStagesActive(newVal) {
                if (newVal) {
                    if (this.eventDetails && this.eventDetails.palcos) {
                        this.selectedStages = this.eventDetails.palcos.map(p => ({
                            id: p.id,
                            nome: p.nome,
                        }));
                    } else {
                        this.selectedStages = [];
                    }
                    this.stageToAdd = "";
                    this.paginationPage = 1;
                }
            },
        },
        async created() {
            await this.fetchAllStages();
        },
        methods: {
            async fetchAllStages() {
                try {
                    const response = await axios.get("https://localhost:7216/api/Helper/GetAllStages");
                    this.allStages = response.data.map(stage => ({
                        id: stage.id,
                        nome: stage.name
                    }));
                } catch (error) {
                    Swal.fire("Erro", "Não foi possível carregar palcos.", "error");
                }
            },
            addStage() {
                if (this.stageToAdd === "" || this.stageToAdd === null) return;

                const stageId = Number(this.stageToAdd);
                const stage = this.allStages.find(p => p.id === stageId);

                const alreadySelected = this.selectedStages.some(s => s.id === stageId);

                if (stage && !alreadySelected) {
                    this.selectedStages.push({ id: stage.id, nome: stage.nome });
                    this.stageToAdd = "";
                    this.paginationPage = this.pageCount;
                }
            },
            removeStage(id) {
                this.selectedStages = this.selectedStages.filter((p) => p.id !== id);
                if (
                    this.paginationPage > 1 &&
                    this.selectedStages.length <=
                    (this.paginationPage - 1) * this.stagesPerPage
                ) {
                    this.paginationPage--;
                }
            },
            changePage(page) {
                if (page < 1 || page > this.pageCount) return;
                this.paginationPage = page;
            },
            async Edit() {
                try {
                    await axios.post("https://localhost:7216/api/Admin/EditEventStages", {
                        EventId: this.eventDetails.id,
                        Palcos: this.selectedStages.map((p) => p.id),
                    });

                    Swal.fire("Sucesso", "Lista de Palcos atualizada com sucesso!", "success");
                    this.closeEditEventStagesModal();
                } catch (error) {
                    const message =
                        error.response?.data?.message || "Erro ao atualizar. Tente novamente.";
                    Swal.fire("Erro", message, "error");
                }
            },
            closeEditEventStagesModal() {
                this.stageToAdd = "";
                this.paginationPage = 1;
                this.$emit("closeEditEventStagesModal");
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
