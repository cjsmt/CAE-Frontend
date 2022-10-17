import Mock from 'mockjs'
import './user'

const scoreData = Mock.mock('http://localhost:8081/num', 'get', {
	"attributes": {
		"position": {
			"itemSize": 3,
			"type": "Float32Array",
			"array": [ 2.3,4.5,1.4]
		},
		"pressure": {
			"itemSize": 1,
			"type": "Float32Array",
			"array": [ 3.2]
		}
	},
	"index": {
		"type": "Uint16Array",
		"array": [ 1,2,3]
	}

})
