<template>
  <div class="flex justify-center lg:items-center h-screen max-w-full">
    <div class="card bg-base-100 min-w-full lg:card-bordered lg:shadow-xl lg:h-5/6 lg:min-w-[960px] lg:overflow-x-hidden">
      <div class="card-body p-0 h-full">
        <h2 class="card-title">
          <p class="pl-4 pt-2 text-xl">XTERRA Triathlon Cup Results</p>
          <label class="swap swap-rotate absolute right-2 top-2">
            <input 
              data-toggle-theme="dim,light" 
              data-act-class="ACTIVECLASS" 
              type="checkbox" 
              class="theme-controller" 
              value="synthwave" 
            />
            <span class="swap-off material-symbols-outlined">light_mode</span>
            <span class="swap-on material-symbols-outlined">dark_mode</span>
          </label>
        </h2>
        <div v-if="status === IS_LOADING" class="flex items-center justify-center h-full">
          <span class="loading loading-spinner loading-lg" />
        </div>
        <div v-else-if="status === IS_READY" class="overflow-auto">
          <Table :records="records" />
        </div>
        <div v-else="status === IS_ERROR" class="m-5 flex flex-col items-center justify-center h-full">
          Something went wrong, please try again.
          <div class="text-center m-5">
            <button @click="fetchRecords" class="btn btn-neutral">Retry</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup async>
  import { ref, onMounted } from 'vue';
  import { themeChange } from 'theme-change'
  import Table from './table.vue';
  
  const IS_ERROR = 3;
  const IS_LOADING = 2;
  const IS_READY = 1;
  const records = ref([]);
  const status = ref(IS_LOADING);
  const url = 'https://core.xterraplanet.com/api/application-task/cee4389b-1668-4e39-b500-3572f0982b09';

  const fetchRecords = async () => {
    status.value = IS_LOADING;

    try {
      const response = await fetch(url);
      
      if (!response.ok) throw 'error';

      records.value = await response.json();
      status.value = IS_READY;
    } catch (error) {
      status.value = IS_ERROR;
    }
  };

  onMounted(() => {
    fetchRecords();
    themeChange(false);
  });
</script>