import config from '../config';
import permissions from './permissions';
              
export default class AclService {
	static hasRole(userRoles, targetRole)
	{
		console.log("Checking " + targetRole);
		console.log("Got : " + userRoles);
		return (userRoles.indexOf(targetRole) >= 0);
	}
	
	static checkAllRoles(userRoles, section, subSection, operation)
	{
		let _isAllowed = false;
		
		userRoles.forEach(function (subRole) {
			_isAllowed = _isAllowed || AclService.isAllowed(subRole, section, subSection, operation);
		})
		
		return _isAllowed;
	}
    static isAllowed(userRole, section, subSection, operation)
    {
    	let _isAllowed = false;
    	
    	if( section in permissions && subSection in permissions[section] && operation in permissions[section][subSection] )
    	{
			if( permissions[section][subSection][operation].indexOf(userRole) >= 0 )
			{
				_isAllowed = true;
			}
			else
			{
				_isAllowed = AclService.isAllowedFromHierarchy(userRole, section, subSection, operation);
			}
    	}                  
    	
    	return _isAllowed;
	}
	
	static isAllowedFromHierarchy(userRole, section, subSection, operation) 
	{
		let _isAllowed = false;
		
		if( userRole in config.roles_hierarchy && config.roles_hierarchy[userRole].length > 0 )
		{
			config.roles_hierarchy[userRole].forEach(function(subRole) {
				_isAllowed = _isAllowed || AclService.isAllowed(subRole, section, subSection, operation);
			})
		}   
		
		return _isAllowed;
	}
}