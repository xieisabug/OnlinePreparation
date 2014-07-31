package com.xjy.op.dao;

import com.xjy.op.dto.UserDto;
import com.xjy.op.web.command.UserCommand;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import java.util.List;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration("file:src/main/webapp/WEB-INF/mvc-dispatcher-servlet.xml")
public class UserDaoTest {

    @Autowired
    private UserDao userDao;

    @Test
    public void testLogin() throws Exception {
        UserCommand loginUser = new UserCommand();
        loginUser.setUsername("admin");
        loginUser.setPassword("123456");
        UserDto user = userDao.login(loginUser);
        Assert.assertNotNull(user);
        Assert.assertEquals("管理员",user.getName());
    }

    @Test
    public void testGetFriendsByUserId() throws Exception {
        List<UserDto> friends = userDao.getFriendsByUserId(6,1);
        Assert.assertEquals(2,friends.size());
    }

    @Test
    public void testAddFriend() throws Exception {
        Assert.assertTrue(userDao.addFriend(8, 9));
    }

    @Test
    public void testDeleteFriends() throws Exception {
        Assert.assertTrue(userDao.deleteFriend(8, 9));
    }

    @Test
    public void testSearchUser() throws Exception {
        Assert.assertNotNull("通过用户身份证查询失败",userDao.searchUserByIdCard("123456789"));
        Assert.assertNotNull("通过用户qq查询失败",userDao.searchUserByQq("123456"));
        Assert.assertNotNull("通过用户姓名查询失败",userDao.searchUserByName("管理员"));
        System.out.println(userDao.searchUserByName("管理"));
    }
}
