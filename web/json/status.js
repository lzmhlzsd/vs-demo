var status_list = [
    { status_id: 1, color: '#41506d', name: '停机' },
    { status_id: 2, color: '#3fb756', name: '运行' },
    { status_id: 3, color: '#e9513d', name: '报警' },
    { status_id: 4, color: '#386cd7', name: '空闲' },
    { status_id: 5, color: '#797979', name: '关机' }
]
if ( typeof module != 'undefined' ) {
    module.exports = status_list;
}