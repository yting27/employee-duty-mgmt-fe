<template>
  <div class="dropdown">
    <button
      class="btn btn-outline-secondary dropdown-toggle w-100 text-start"
      type="button"
      :id="dropdownId"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <span v-if="selectedValues.length === 0">{{ placeholder }}</span>
      <span v-else-if="selectedValues.length === 1">
        {{ getOptionLabel(selectedValues[0]) }}
      </span>
      <span v-else>
        {{ selectedValues.length }} {{ $t('common.selected') }}
      </span>
    </button>
    <ul class="dropdown-menu w-100" :aria-labelledby="dropdownId">
      <li>
        <label class="dropdown-item" @click.stop>
          <input
            type="checkbox"
            :checked="isAllSelected"
            @change="toggleSelectAll"
            class="form-check-input me-2"
          />
          {{ $t('common.selectAll') }}
        </label>
      </li>
      <li v-for="option in options" :key="option.value">
        <label class="dropdown-item" @click.stop>
          <input
            type="checkbox"
            :value="option.value"
            v-model="selectedValues"
            @change="handleChange"
            class="form-check-input me-2"
          />
          {{ option.label }}
        </label>
      </li>
    </ul>
  </div>
</template>

<script>
import LanguageMixin from '../mixins/LanguageMixin'

export default {
  name: 'MultiSelectDropdown',
  mixins: [LanguageMixin],
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    options: {
      type: Array,
      required: true,
      validator: (options) => {
        return options.every(opt => 'value' in opt && 'label' in opt)
      }
    },
    placeholder: {
      type: String,
      default: 'Select options...'
    },
    dropdownId: {
      type: String,
      default: () => `dropdown-${Math.random().toString(36).slice(2, 9)}`
    }
  },
  computed: {
    selectedValues: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    },
    isAllSelected() {
      return this.options.length > 0 && this.selectedValues.length === this.options.length
    }
  },
  methods: {
    handleChange() {
      this.$emit('change', this.selectedValues)
    },
    toggleSelectAll(event) {
      if (event.target.checked) {
        this.selectedValues = this.options.map(opt => opt.value)
      } else {
        this.selectedValues = []
      }
      this.$emit('change', this.selectedValues)
    },
    getOptionLabel(value) {
      const option = this.options.find(opt => opt.value === value)
      return option ? option.label : value
    }
  }
}
</script>

<style scoped>
/* Dropdown multi-select styling */
.dropdown-menu {
  max-height: 300px;
  overflow-y: auto;
}

.dropdown-item {
  cursor: pointer;
  padding: 0.5rem 1rem;
}

.dropdown-item label {
  cursor: pointer;
  margin-bottom: 0;
  width: 100%;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.dropdown-item input[type="checkbox"] {
  cursor: pointer;
}

.dropdown-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
