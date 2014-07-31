package com.xjy.op.dao;

import com.xjy.op.dto.UserDto;
import com.xjy.op.util.EncodeUtils;
import com.xjy.op.web.command.UserCommand;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class UserDao {

    //用户登陆
    public UserDto login(UserCommand user) {
        //通过用户名获取到密码
        String password = jdbcTemplate.queryForObject("select password from s_user where username=?",
                String.class, user.getUsername());
        //验证密码是否正确，如果正确则返回相对应的User对象，不正确则什么都不返回，程序的最后会返回null
        if (EncodeUtils.validatePassword(password, user.getPassword())) {
            return jdbcTemplate.queryForObject(
                    "select * from s_user where username=?",
                    new Object[]{user.getUsername()},
                    new UserMapper());
        }
        return null;
    }

    //获取好友列表
    public List<UserDto> getFriendsByUserId(int id, int spaceId) {
        return jdbcTemplate.query(
                "select * from s_user where id in (select userId from op_user_space_join where spaceId=? and userId!=?)",
                new Object[]{spaceId, id},
                new UserMapper());
    }

    //添加一个好友
    public boolean addFriend(int friendId, int spaceId) {
        return jdbcTemplate.update("insert into op_user_space_join values(?,?)", friendId, spaceId) == 1;
    }

    //删除一个好友
    public boolean deleteFriend(int userId, int spaceId) {
        return jdbcTemplate.update("delete from op_user_space_join where userId=? and spaceId=?",
                userId, spaceId) == 1;
    }

    //通过用户姓名搜索用户
    public List<UserDto> searchUserByName(String name) {
        return jdbcTemplate.query(
                "select * from s_user where name like ?",
                new Object[]{"%" + name + "%"},
                new UserMapper()
        );
    }

    //通过qq搜索用户
    public List<UserDto> searchUserByQq(String qq) {
        return jdbcTemplate.query(
                "select * from s_user where qq like ?",
                new Object[]{"%" + qq + "%"},
                new UserMapper()
        );
    }

    //通过身份证搜索用户
    public List<UserDto> searchUserByIdCard(String idCard) {
        return jdbcTemplate.query(
                "select * from s_user where idcard like ?",
                new Object[]{"%" + idCard + "%"},
                new UserMapper()
        );
    }

    public UserDto getUserById(int userId) {
        return jdbcTemplate.queryForObject(
                "select * from s_user where id=?",
                new Object[]{userId},
                new UserMapper()
        );
    }

    //用户映射的类
    private final class UserMapper implements RowMapper<UserDto> {
        @Override
        public UserDto mapRow(ResultSet resultSet, int i) throws SQLException {
            UserDto userDto = new UserDto();
            userDto.setId(resultSet.getInt("id"));
            userDto.setUsername(resultSet.getString("username"));
            userDto.setName(resultSet.getString("name"));
            userDto.setBirth(resultSet.getDate("birth"));
            userDto.setDepartment(resultSet.getString("department"));
            userDto.setEmail(resultSet.getString("email"));
            userDto.setQq(resultSet.getString("qq"));
            userDto.setSex(resultSet.getString("sex"));
            userDto.setTelephone(resultSet.getString("telephone"));
            return userDto;
        }
    }

    private JdbcTemplate jdbcTemplate;

    @Autowired
    public void setDatasource(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }
}
