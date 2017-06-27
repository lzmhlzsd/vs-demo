var status_list = [
    // { status_id: 1, color: '#41506d', name: '停机' },e9513d
    // { status_id: 2, color: '#3fb756', name: '运行' },
    // { status_id: 3, color: '#e9513d', name: '空闲' },d68d26
    // { status_id: 4, color: '#386cd7', name: '离线' },b0aaaa
    // { status_id: 5, color: '#797979', name: '调试' }1782c7
    { status_id: 1, color: '#e9513d', name: '停机' },
    { status_id: 2, color: '#3fb756', name: '运行' },
    { status_id: 3, color: '#d68d26', name: '空闲' },
    { status_id: 4, color: '#b0aaaa', name: '离线' },
    { status_id: 5, color: '#1782c7', name: '调试' }
]
if ( typeof module != 'undefined' ) {
    module.exports = status_list;
}