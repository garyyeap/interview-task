<template>
  <table class="table table-zebra table-pin-rows">
    <thead>
      <tr class="bg-base-300">
        <th>#</th>
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
    <tbody class="css-serial">
      <tr v-for="(record, index) in records">
        <td>{{ index + 1 }}</td>
        <td>{{ record.first_name }} {{ record.last_name }}</td>
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
  import { ref, onBeforeUpdate, onMounted } from 'vue';
  import { isValidTotalTime, isValidSwimTime, isValidRunTime, isValidBikeTime } from './triathlon';
  import { formatedTimeToSeconds } from './time';
  
  const props = defineProps(['records', 'searchKey']);
  const records = ref([]);
  let normalizedRecords = [];

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

  onBeforeUpdate(() => {

    if (props.searchKey.length > 1) {
      const searchKey = props.searchKey.toUpperCase();

      records.value = Array.from(normalizedRecords).filter(({ first_name, last_name }) => {
        return (first_name + ' ' + last_name).toUpperCase().includes(searchKey);
      }).sort((a, b) => { // consider to change to toSorted() when possible to aviod side effect
        return formatedTimeToSeconds(a.total_time) - formatedTimeToSeconds(b.total_time);
      });
    } else {
      records.value = Array.from(normalizedRecords).sort((a, b) => { // consider to change to toSorted() when possible to aviod side effect
        return formatedTimeToSeconds(a.total_time) - formatedTimeToSeconds(b.total_time);
      });
    }
  });

  onMounted(async () => {
    
    normalizedRecords = props.records.filter((record) => { 
      const isValid = isValidTotalTime(formatedTimeToSeconds(record.total_time));

      if (isValid) expandSplits(record);

      return isValid;
    });
    
    const _records = Array.from(normalizedRecords); 

    markFastest(_records, 'swim', isValidSwimTime);
    markFastest(_records, 'run', isValidRunTime);
    markFastest(_records, 'bike', isValidBikeTime);
        
    records.value = Array.from(normalizedRecords).sort((a, b) => { // consider to change to toSorted() when possible to aviod side effect
      return formatedTimeToSeconds(a.total_time) - formatedTimeToSeconds(b.total_time);
    });
  });
</script>