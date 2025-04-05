// 系统字段映射表
const fieldMaps = {
  vehicle: {
    batteryVoltage: '蓄电池电压',
    lockStatus: '解锁状态',
    readyStatus: 'READY',
    parkingBrake: '手刹状态',
    gear: '档位状态',
    brake: '制动状态',
    speed: '车速',
    mileage: '总里程',
    ops: 'OPS状态',
    coolantTemp: '冷却水温',
    fan: '散热风扇',
    powerMode: '动力模式',
    fault: '故障状态'
  },
  operation: {
    lift: '举升状态',
    tilt: '倾斜状态',
    shift: '侧移状态',
    flip: '翻转状态',
    pumpRpm: '油泵电机转速',
    pumpTorque: '油泵电机扭矩',
    pumpCurrent: '油泵电机电流',
    pumpVoltage: '油泵电机电压',
    hydraulicPressure: '液压系统压力'
  },
  battery: {
    voltage: '电压',
    current: '电流',
    soc: 'SOC'
  },
  thermal: {
    compressor: '压缩机状态',
    expansionValve: '电子膨胀阀状态',
    coolingPump: '冷却水泵状态',
    circulationPump: '循环泵状态',
    ptc: 'PTC状态'
  }
}

// 基础数据模板
const baseData = {
  // 整车状态
  vehicle: {
    batteryVoltage: { value: 13.5, min: 13, max: 14, unit: 'V' },
    lockStatus: { options: ['已锁定', '未锁定'], unit: '' },
    readyStatus: { options: ['READY', 'OFF'], unit: '' },
    parkingBrake: { options: ['已拉手刹', '未拉手刹'], unit: '' },
    gear: { options: ['前进', '空挡', '后退'], unit: '' },
    brake: { options: ['制动', '未制动'], unit: '' },
    speed: { value: 0, min: 0, max: 60, unit: 'km/h' },
    mileage: { value: 7796, increment: 0.01, unit: 'km' },
    ops: { options: ['正常', '异常'], unit: '' },
    coolantTemp: { value: 3.7, min: 0, max: 120, unit: '°C' },
    fan: { options: ['运行中', '停止'], unit: '' },
    powerMode: { options: ['经济', '标准', '强劲'], unit: '' },
    fault: { options: ['无故障', '电机故障', '电池故障'], unit: '' }
  },

  // 作业系统
  operation: {
    lift: { options: ['上升', '下降', '停止'], unit: '' },
    tilt: { options: ['前倾', '后倾', '水平'], unit: '' },
    shift: { options: ['左移', '右移', '中位'], unit: '' },
    flip: { options: ['翻转', '正常'], unit: '' },
    pumpRpm: { value: 1764, min: 1000, max: 2000, unit: 'RPM' },
    pumpTorque: { value: 52.7, min: 30, max: 80, unit: 'Nm' },
    pumpCurrent: { value: 45.1, min: 30, max: 60, unit: 'A' },
    pumpVoltage: { value: 72.4, min: 60, max: 80, unit: 'V' },
    hydraulicPressure: { value: 5.5, min: 0, max: 10, unit: 'MPa' }
  },

  // 动力电池
  battery: {
    voltage: { value: 320.3, min: 315, max: 325, unit: 'V' },
    current: { value: 26.0, min: -50, max: 50, unit: 'A' }, // 充电为负值
    soc: { value: 14.1, min: 0, max: 100, unit: '%' }
  },

  // 热管理系统
  thermal: {
    compressor: { options: ['运行中', '停止'], unit: '' },
    expansionValve: { options: ['开启', '关闭'], unit: '' },
    coolingPump: { options: ['运行中', '停止'], unit: '' },
    circulationPump: { options: ['运行中', '停止'], unit: '' },
    ptc: { options: ['运行中', '停止'], unit: '' }
  }
}

// 生成随机波动值
function fluctuate(base, config) {
  const range = (config.max - config.min) * 0.05 // 波动范围5%
  let newValue = base + (Math.random() * range * 2 - range)
  return parseFloat(Math.max(config.min, Math.min(config.max, newValue)).toFixed(2))
}


// 模拟数据生成器
export default {
  getMockData(prevData) {
    const result = {}
    
    Object.keys(baseData).forEach(system => {
      result[system] = {}
      
      Object.keys(baseData[system]).forEach(key => {
        const config = baseData[system][key]
        const prevValue = prevData?.[system]?.[key]?.value
        
        // 选项型数据
        if (config.options) {
          // 5%概率触发状态变化
          if (!prevValue || Math.random() < 0.05) {
            result[system][key] = {
              value: config.options[Math.floor(Math.random() * config.options.length)],
              unit: config.unit
            }
          } else {
            result[system][key] = { value: prevValue, unit: config.unit }
          }
        } 
        // 数值型数据
        else {
          const base = prevValue || config.value
          let newValue
          
          // 特殊字段处理
          if (key === 'mileage') {
            newValue = (parseFloat(base) + config.increment).toFixed(2)
          } else {
            newValue = fluctuate(parseFloat(base), config)
          }
          
          result[system][key] = {
            value: newValue,
            unit: config.unit,
            // 添加趋势指示(仅数值型)
            trend: prevValue ? 
              (newValue > prevValue ? 'up' : newValue < prevValue ? 'down' : null) : null
          }
        }
        
        // 随机生成异常状态(10%概率)
        if (Math.random() < 0.1) {
          result[system][key].status = Math.random() < 0.7 ? 'warning' : 'error'
          result[system][key].alert = true
        } else {
          result[system][key].status = 'normal'
          result[system][key].alert = false
        }
      })
    })
    
    return result
  }
}