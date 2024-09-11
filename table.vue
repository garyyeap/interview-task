<template>
  <table class="table table-zebra table-pin-rows">
    <thead>
      <tr class="bg-base-300">
        <th>Name</th>
        <th>Gender</th>
        <th>Nationality</th>
        <th>Division</th>
        <th>Total Time</th>
        <th>Swim > Bike > Run
          <span class="badge badge-outline badge-sm absolute right-[20px] px-[3px] py-[7px]">
            <span class="material-symbols-outlined text-yellow-400 text-sm align-sub">trophy</span>
            &nbsp;Fastest Overall
          </span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="record in records">
        <th>{{ record.first_name }} {{ record.last_name }}</th>
        <td>{{ record.gender }}</td>
        <td>{{ record.nationality }}</td>
        <td>{{ record.division }}</td>
        <td>{{ record.total_time }}</td>
        <td>
          <div class="breadcrumbs text-sm">
            <ul>
              <li>
                <span v-if="record.fastest_swim" class="material-symbols-outlined text-base text-yellow-400">trophy</span>
                <span v-else class="material-symbols-outlined text-base">pool</span>
                &nbsp;{{ record.swim_time }}
              </li>
              <li>
                <span v-if="record.fastest_bike" class="material-symbols-outlined text-base text-yellow-400">trophy</span>
                <span v-else class="material-symbols-outlined text-base">directions_bike</span>
                &nbsp;{{ record.bike_time }}
              </li>
              <li>
                <span v-if="record.fastest_run" class="material-symbols-outlined text-base text-yellow-400">trophy</span>
                <span v-else class="material-symbols-outlined text-base">directions_run</span>
                &nbsp;{{ record.run_time }}
              </li>
            </ul>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script setup>
  import { ref, onMounted } from 'vue';
  import { isValidTotalTime, isValidSwimTime, isValidRunTime, isValidBikeTime } from './triathlon';
  import { formatedTimeToSeconds } from './time';
  
  const props = defineProps(['records']);
  const records = ref([]);

  const expandSplits = (record) => {
    record.splits.forEach(item => {
      record[item.name] = item.time;
    });

    delete record.splits;
  };

  const markFastest = (data, type, isValidTime) => {
    const key = type + '_time';

    data = data.filter((record) => {
      return isValidTime(formatedTimeToSeconds(record[key]));
    }).sort((a, b) => { // consider to change to toSorted() when possible to aviod side effect
      return formatedTimeToSeconds(a[key]) - formatedTimeToSeconds(b[key]);
    });

    data[0]['fastest_' + type] = true;
  };
  
  onMounted(async () => {
    const sortedRecords = props.records.filter((record) => { 
      const isValid = isValidTotalTime(formatedTimeToSeconds(record.total_time));

      if (isValid) expandSplits(record);

      return isValid;
    }).sort((a, b) => { // consider to change to toSorted() when possible to aviod side effect
      return formatedTimeToSeconds(a.total_time) - formatedTimeToSeconds(b.total_time);
    });
    
    const _records = Array.from(sortedRecords); 

    markFastest(_records, 'swim', isValidSwimTime);
    markFastest(_records, 'run', isValidRunTime);
    markFastest(_records, 'bike', isValidBikeTime);
        
    records.value = sortedRecords;
  });
</script>