var sqlMap = {
    user:{
        add:'insert into user ( username , password ) values ( ?, ? )',
        query_user:'select * from user where username = ?',
    },
    film:{
        query_few_movie:'select * from entertainment where etype=1 order by eno desc limit 5',
        query_few_opera:'select * from entertainment where etype=2 order by eno desc limit 5',
        query_few_tvshow:'select * from entertainment where etype=3 order by eno desc limit 5',
        query_few_book:'select * from entertainment where etype=4 order by eno desc limit 5',
        query_all_item:'select * from entertainment where etype = ? order by eno desc limit ?,3',
        query_item_detail:'select * from entertainment where eno = ?'
    },
    comment:{
        query_my_comment:'select * from usercomment where userno = ? and filmno = ?',
        add_my_comment:'insert into usercomment ( filmno , userno , score , comment , commenttime ) values ( ?, ?, ?, ?, ? )',
        update_my_comment:'update usercomment set score = ?, comment = ?, commenttime = ? where filmno = ? and userno = ?',
        query_hot_comment:'select user.username,usercomment.* from user,usercomment where user.userid = usercomment.userno and usercomment.filmno = ? order by commentlike desc limit 10',
        query_all_comment:'select user.username,usercomment.* from user,usercomment where user.userid = usercomment.userno and usercomment.filmno = ? order by ucno desc',
        query_thumb_list:'select * from commentlike where userno = ? and likeit = "1"',
        query_has_like:'select * from commentlike where ucno = ? and userno = ?',
        add_my_like:'insert into commentlike ( ucno, userno , likeit) values( ?, ?, 1)',
        update_my_like:'update commentlike set likeit = ? where ucno = ? and userno = ?',
        add_total_like:'update usercomment set commentlike = commentlike+1 where ucno = ?',
        subtract_total_like:'update usercomment set commentlike = commentlike-1 where ucno = ?'
    },
    filmstar:{
        query_totally_star:'select count(*) as count ,avg(score) as score from usercomment where filmno = ?',
        query_every_star:'select count(*) as count1,score from usercomment where filmno = ? group by score'
    },
    serachWord:{
        query_my_word:'select * from entertainment where replace(ename," ","") like ? order by eno desc',
    }
}

module.exports = sqlMap;